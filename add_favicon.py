import os

html_files = ['index.html', 'shop.html', 'product.html', 'contact.html', 'client_care.html']
favicon_tag = '    <link rel="icon" type="image/jpeg" href="favicon_taiko_nina.jpg" />\n'

for file in html_files:
    try:
        with open(file, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if 'favicon_taiko_nina.jpg' not in content:
            new_content = content.replace('</head>', f'{favicon_tag}</head>')
            with open(file, 'w', encoding='utf-8') as f:
                f.write(new_content)
    except FileNotFoundError:
        print(f"File {file} not found, skipping.")

print("Favicon added.")
