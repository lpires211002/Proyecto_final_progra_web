import { MercadoPagoConfig, Preference } from 'mercadopago';

// Esta función es ejecutada por Vercel cuando llamamos a /api/checkout
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { cartItems } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        // Tienes que poner tu Access Token de prueba aquí abajo, o 
        // usar process.env.MP_ACCESS_TOKEN si lo configuras en Vercel
        const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN || "TEST-TU-ACCESS-TOKEN-AQUI"; 
        
        const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
        const preference = new Preference(client);

        // Mapeamos los items del carrito al formato que pide Mercado Pago
        const items = cartItems.map(item => {
            return {
                id: item.id.toString(),
                title: `${item.name} (${item.size})`,
                unit_price: Number(item.price),
                quantity: Number(item.quantity),
                currency_id: 'ARS', // Puedes cambiarlo a USD, MXN, CLP, etc.
                picture_url: item.img
            };
        });

        const body = {
            items: items,
            back_urls: {
                success: "https://taiko-nina.vercel.app/shop.html?status=success", // Cambiar por URLs de tu dominio final si tienes
                failure: "https://taiko-nina.vercel.app/shop.html?status=failure",
                pending: "https://taiko-nina.vercel.app/shop.html?status=pending"
            },
            auto_return: "approved"
        };

        const result = await preference.create({ body });
        
        // Retornamos el id y el punto de inicio para redirigir al checkout
        return res.status(200).json({ 
            id: result.id, 
            init_point: result.init_point 
        });

    } catch (error) {
        console.error("MercadoPago Error:", error);
        return res.status(500).json({ error: error.message });
    }
}
