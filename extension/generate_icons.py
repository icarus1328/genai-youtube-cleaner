import os
from PIL import Image, ImageDraw

def create_icon(size, output_path):
    # Create a simple red square icon with rounded corners
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # YouTube Red
    bg_color = (255, 0, 0, 255)
    
    # Draw rounded rectangle
    radius = size // 5
    draw.rounded_rectangle([(0, 0), (size, size)], radius=radius, fill=bg_color)
    
    # Draw a simple white minus/block sign (or play button with slash?)
    # Let's just draw a white 'X' or '-'
    # We'll just draw a white '-'
    line_thickness = max(2, size // 8)
    margin = size // 4
    draw.line([(margin, size//2), (size-margin, size//2)], fill=(255, 255, 255, 255), width=line_thickness)

    img.save(output_path)

if __name__ == "__main__":
    os.makedirs('icons', exist_ok=True)
    sizes = [16, 32, 48, 128]
    for size in sizes:
        create_icon(size, f'icons/icon-{size}.png')
    print("Icons generated successfully.")
