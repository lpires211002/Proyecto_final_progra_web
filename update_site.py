import re
import os

footer_html = """    <footer class="bg-zinc-100 dark:bg-zinc-900 border-t-0 full-width mt-auto">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-16 px-12 py-24 w-full max-w-[1600px] mx-auto text-on-surface">
            <!-- Brand Info -->
            <div>
                <div class="text-xl font-serif italic mb-6 text-zinc-950 dark:text-zinc-50">taiko.nina</div>
                <p class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] leading-relaxed">
                    Atelier Collection. Defining modern femininity through precision and grace.
                </p>
            </div>
            <!-- Navigation Links -->
            <div>
                <h4 class="font-label text-zinc-950 dark:text-zinc-50 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">
                    Navigation</h4>
                <ul class="space-y-4">
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="index.html">Home</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="shop.html">Collection</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="index.html#our-story">Our Story</a></li>
                </ul>
            </div>
            <!-- Contact Links -->
            <div>
                <h4 class="font-label text-zinc-950 dark:text-zinc-50 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Contact
                </h4>
                <ul class="space-y-4">
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="client_care.html">Client Care</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="tel:+13054567890">+1 (305) 456-7890</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="https://instagram.com/taiko.nina" target="_blank">Instagram</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="#" onclick="alert('Próximamente'); return false;">Press Inquiries</a></li>
                    <li><a class="font-label text-zinc-500 dark:text-zinc-400 text-[10px] uppercase tracking-[0.2em] hover:text-zinc-950 dark:hover:text-zinc-200 transition-all duration-300"
                            href="#" onclick="alert('Próximamente'); return false;">Privacy</a></li>
                </ul>
            </div>
            <!-- Newsletter -->
            <div>
                <h4 class="font-label text-zinc-950 dark:text-zinc-50 text-[10px] uppercase tracking-[0.2em] mb-8 font-bold">Newsletter
                </h4>
                <form id="newsletter-form" class="flex border-b border-zinc-300 dark:border-zinc-700 py-2 relative">
                    <input id="newsletter-email" required
                        class="bg-transparent border-none text-[10px] uppercase tracking-[0.2em] focus:ring-0 w-full placeholder:text-zinc-400 text-on-surface"
                        placeholder="Email Address" type="email" />
                    <button type="submit" class="material-symbols-outlined text-outline hover:text-primary transition-colors cursor-pointer">arrow_forward</button>
                    <p id="newsletter-msg" class="absolute top-12 left-0 text-[10px] uppercase tracking-widest text-[#5c6858] font-bold hidden"></p>
                </form>
            </div>
        </div>
        <div class="px-12 py-12 border-t border-zinc-200 dark:border-zinc-800 text-center">
            <p class="font-label text-[10px] uppercase tracking-[0.2em] text-zinc-400">© 2024 taiko.nina. Atelier Collection.</p>
        </div>
    </footer>"""

html_files = ['index.html', 'shop.html', 'product.html', 'contact.html', 'inspo.html', 'outfits.html']

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = re.sub(r'<footer.*?</footer>', footer_html, content, flags=re.DOTALL)
    
    with open(file, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Footers updated.")

# Create client_care.html based on contact.html
with open('contact.html', 'r', encoding='utf-8') as f:
    client_care_content = f.read()

client_care_main = """    <main class="min-h-screen py-32 px-12 lg:px-24 flex items-center justify-center bg-surface border-b border-outline-variant/20">
        <div class="max-w-[800px] w-full space-y-12 text-center">
            <span class="font-label text-[10px] uppercase tracking-[0.4em] text-outline mb-6 block">Support</span>
            <h1 class="serif-headline text-5xl md:text-7xl font-light italic tracking-tighter leading-none mb-12">Client Care</h1>
            <p class="font-body text-xl text-on-surface-variant font-light leading-relaxed">
                Our dedicated team is here to assist you with order inquiries, sizing guidance, and styling advice. 
                We strive to provide a seamless and personalized shopping experience.
            </p>
            <div class="pt-12 flex justify-center gap-8">
                <a href="mailto:care@taikonina.com" class="font-label text-[10px] uppercase tracking-[0.2em] border-b border-primary/20 hover:border-primary transition-colors pb-1">Email Support</a>
                <a href="tel:+13054567890" class="font-label text-[10px] uppercase tracking-[0.2em] border-b border-primary/20 hover:border-primary transition-colors pb-1">Call Us</a>
            </div>
        </div>
    </main>"""

client_care_content = re.sub(r'<main.*?</main>', client_care_main, client_care_content, flags=re.DOTALL)
client_care_content = client_care_content.replace("<title>taiko.nina | Contact</title>", "<title>taiko.nina | Client Care</title>")

with open('client_care.html', 'w', encoding='utf-8') as f:
    f.write(client_care_content)

print("client_care.html created.")
