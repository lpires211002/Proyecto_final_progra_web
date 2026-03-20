-- schema.sql
-- Run this in your Supabase SQL Editor to create the products table

CREATE TABLE IF NOT EXISTS public.products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category TEXT,
    image_url TEXT,
    color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Note: Enable Row Level Security if you plan to keep data safe, 
-- but for a simple read-only catalog, we want the public to be able to read:
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);

-- Insert original mock products
INSERT INTO public.products (name, price, category, color, image_url) VALUES 
('L''Aube Silk Slip Dress', 350.00, 'Dresses', 'Bone White', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBuw98CIhy-IsIpmgcg5G7nRmkjX_fW8wNjS-rFX6jRPUwLkIc_8VzETEFwtHHAONZvTYCW3kzKlKCYkijdzrmdMCCe7tk-HH9goWE5Tbd4f_9LZlMW1YYDIj6atAG4yWgdw6jQhDMr5o3PKge7-Ed0wJ04Uv7F85uBPoPTimhbrKKQa-SDZ_eKWmMrOULFb23SLUaiNX0ZTKmJeTGqPaooni9mtTRFM19kV26OKwNP-fgGVLQykUW5fvrhrlDiWI3cmhFepg-iCHI'),
('Architectural Wool Blazer', 450.00, 'Outerwear', 'Charcoal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAfLPKvS5GhO6iB8Tt41L8iC4dsw9SXvkAJGBA2adEnk_aUbnjixlnlff5to3QEkUb4jvV8-so0fpCC_cLwu3KBdvxBowtXhsl3Z3VmsC2YbqR4vyenc7PPYJ5FBYKCMZ402DwbMOwdhnmZI5cOfPrEi5ar1pkSjvbU8hO2g9H-mfEeD-BZU6446fz17bD8xeK0cHdrZnUpsJqFjy6MO52TEdw0ZR6TDYmI3neDtBp1Y-fJORVbxYrr6n0jzdDJ60JcUah8K3iSzZM'),
('High-Rise Linen Trouser', 280.00, 'Bottoms', 'Sand', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBPTWsclZ21E3vk0XcVw9nKHYnXweYlw87DkcMcNwbtnt2uRomVD5T_hzVdbM2NbI_lIXO7MEzlE9TZ6xm1M_bnmqJT4v30xSONdAFwPjhjNLe_rHfJ_zw4nz-13rwrO_J3UMZR5bnOO9uLiHs8bwDqkWwnQ7r2Abzp3EXN9xEm5o9gIRMnLwNE2aOG4bTsTByx3ThYaQZm0BUO1m7LdDpgD4KVeIKlR00SbGtmPHMGnsKw3KBiKFQ4a0aMTIfEG4fal4RNsraSFlw'),
('Fine Merino Turtleneck', 210.00, 'Knitwear', 'Midnight', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA91x2NXkIRQbl4_x8dgDWFOHO3R8TVjyp7NJy5RFlWPYV3eDD_xwExvHu8URau1hYxPjuxEDuM-0BjnCXvLWLLvsJf1DGj0eu6wbXl1WcTEen3tZYYFHhSr67g67DyYJpHPxmnLNnhTO2dtiNTNUMAah6yIUZL0N5wEQTCY4bs4TH7NX9fU63X4_4xOU9lODpu3yjwwfWmycNYg4LFFEm5F_U0-W00VP_OXGrSVsG3O6FFhdP90tjTM5Hn_SyJjO30MAhPSB0IkEo'),
('The Atelier Poplin Shirt', 190.00, 'Shirts', 'Optic White', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB1F-g_Pr08Tz654NjI1eOaNilR6enAAVZUQZZSCZ_EuWCcU2xqndzXA6UJuYPgupZyWmu3TuShAsTTrFij2ZY2vLLIxFtURTGefEpmWKVQZFkhyNIncgXQszPC89nQcdnoX30yfRcT-DUf6dus9axSchSfb38HbnmVeMWjKI6zer8OMWRL7n2ab-jnXkKgP3Y4NAaVUH24pHIHGlOVlF1QDXWymwc6Q0bIo18uUf7M44STf4Lp_whuLoyPrjxa4bnCYWReFLTd5dw'),
('Double-Face Cashmere Coat', 890.00, 'Outerwear', 'Taupe', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCyOxDNDaYGa1SoW1bVF6o0zPxpRPj41PZ47ZcAKgHS2i6mdn4co9IaxVh3Q5sz0Ybp6ox-YgveXkQqKGNJxitV6IpbU5lTgJWxEOVDr25Mo9FjNs74NUrfIJ63AGmJygYjhX-ACdk8I4rtQD38vmZMZdzG_YPgBgR0RQocnL5KT845S-nyCjDl5E06KzbZnWRtkO8sNcJlGJFGqJwZYdDcQtvSZnEFtlljf33V6gsma-5kBWxkLjnjzDm7nYswa2Q9YGSJFAVs9zY'),
('The Sculpted Wool Coat', 890.00, 'Outerwear', 'Charcoal', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMiz8Vo7unuH_N-MLR1irttWlP1STrrAxtPw9KrDlWO6XyLw744N4CKsCHzVUKILN-ym9C0wG-SFxn_IYovaKrRmZD0SRST0aChyF3cktodQ2aQraaooU18bNtlcyc97Ho8u63hWyQ29LP7BmokgmNm56zYFlstZHYG65nj5CHnI0FLnZ4U3JQlWSLMwne8wi14ECQKx0zxgPWGFiO8mfiNTOSBflEV-2YHG5Na3Wa8Mu2C813AwFXzICroO8mpkzG05h38EDqBTE');
