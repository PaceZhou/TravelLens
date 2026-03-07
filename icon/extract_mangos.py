#!/usr/bin/env python3
"""
芒果角色抠图脚本
将3x3网格图片分割并去除白色背景
"""
from PIL import Image
from rembg import remove
import os

# 配置
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
INPUT_IMAGE = os.path.join(BASE_DIR, "input/image_7.png")
OUTPUT_DIR = os.path.join(BASE_DIR, "output")

def split_and_remove_bg():
    # 加载图片
    img = Image.open(INPUT_IMAGE)
    width, height = img.size
    
    # 计算每个格子的尺寸
    cell_width = width // 3
    cell_height = height // 3
    
    # 分割并抠图
    index = 1
    for row in range(3):
        for col in range(3):
            # 裁剪子图
            left = col * cell_width
            top = row * cell_height
            right = left + cell_width
            bottom = top + cell_height
            
            cell = img.crop((left, top, right, bottom))
            
            # 去除背景
            output = remove(cell)
            
            # 保存
            output_path = f"{OUTPUT_DIR}/mango_traveller_{index}.png"
            output.save(output_path)
            print(f"✓ 已保存: {output_path}")
            
            index += 1
    
    print(f"\n✅ 完成！共生成 {index-1} 个透明背景图片")

if __name__ == "__main__":
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    split_and_remove_bg()
