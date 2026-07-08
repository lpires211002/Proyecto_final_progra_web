-- ============================================================
-- STOCK: descontar stock cuando una venta queda aprobada
-- Ejecutar en Supabase → SQL Editor
-- ============================================================

-- 1. Flag para no descontar dos veces (MP puede notificar varias veces)
ALTER TABLE orders ADD COLUMN IF NOT EXISTS stock_applied boolean NOT NULL DEFAULT false;

-- 2. Función que descuenta el stock del talle de cada item, una sola vez.
--    SECURITY DEFINER: corre con permisos del dueño, así el webhook la puede
--    invocar aunque use la anon key. Idempotente vía orders.stock_applied.
CREATE OR REPLACE FUNCTION apply_order_stock(ext_ref text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  ord orders%ROWTYPE;
  it  RECORD;
BEGIN
  SELECT * INTO ord FROM orders WHERE external_reference = ext_ref;
  IF NOT FOUND THEN RETURN; END IF;
  IF ord.status <> 'approved' OR ord.stock_applied THEN RETURN; END IF;

  FOR it IN SELECT product_id, size, quantity FROM order_items WHERE order_id = ord.id LOOP
    IF it.product_id IS NULL OR it.size IS NULL THEN CONTINUE; END IF;
    UPDATE products SET
      stock_xs = CASE WHEN lower(it.size) = 'xs' THEN GREATEST(stock_xs - it.quantity, 0) ELSE stock_xs END,
      stock_s  = CASE WHEN lower(it.size) = 's'  THEN GREATEST(stock_s  - it.quantity, 0) ELSE stock_s  END,
      stock_m  = CASE WHEN lower(it.size) = 'm'  THEN GREATEST(stock_m  - it.quantity, 0) ELSE stock_m  END,
      stock_l  = CASE WHEN lower(it.size) = 'l'  THEN GREATEST(stock_l  - it.quantity, 0) ELSE stock_l  END
    WHERE id = it.product_id;
  END LOOP;

  UPDATE orders SET stock_applied = true WHERE id = ord.id;
END;
$$;

-- 3. Permitir que el servidor (webhook) invoque la función
GRANT EXECUTE ON FUNCTION apply_order_stock(text) TO anon, authenticated, service_role;

-- ============================================================
-- VERIFICACIÓN
-- ============================================================
-- SELECT external_reference, status, stock_applied FROM orders ORDER BY created_at DESC;
