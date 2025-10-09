#!/usr/bin/env python3
import re

def convert_layer_fields(content):
    """
    将 layerSubtitles 和 fieldNames 合并成 layerFields
    """

    # 匹配 layerSubtitles: [null], 并记住它前面的缩进
    # 然后找到后面的 fieldNames: [null], 并替换整个区块

    # 首先，我们需要找到每个 layer 对象中的 layerSubtitles 和 fieldNames
    # 然后替换它们

    lines = content.split('\n')
    new_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]

        # 检查是否是 layerSubtitles 行
        if re.match(r'^(\s+)layerSubtitles: \[null\],\s*$', line):
            indent = re.match(r'^(\s+)', line).group(1)
            # 跳过这一行，不添加到 new_lines
            # 继续扫描，寻找对应的 fieldNames
            i += 1

            # 保存中间的行
            middle_lines = []
            found_fieldNames = False

            while i < len(lines):
                current_line = lines[i]

                # 检查是否找到了 fieldNames: [null],
                if re.match(r'^(\s+)fieldNames: \[null\],\s*$', current_line):
                    # 找到了！添加合并后的 layerFields
                    new_lines.append(f'{indent}layerFields: [{{ layerSubtitle: null, fieldName: null }}],')
                    found_fieldNames = True
                    i += 1
                    break
                else:
                    # 保存中间的行
                    middle_lines.append(current_line)
                    i += 1

            # 如果找到了 fieldNames，添加中间的行
            if found_fieldNames:
                new_lines.extend(middle_lines)
            else:
                # 如果没找到，恢复原来的 layerSubtitles 行和中间的行
                new_lines.append(line)
                new_lines.extend(middle_lines)
        else:
            new_lines.append(line)
            i += 1

    return '\n'.join(new_lines)

if __name__ == '__main__':
    input_file = 'src/stores/dataStore.js'
    output_file = 'src/stores/dataStore.js.new'

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = convert_layer_fields(content)

    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Conversion completed. Output saved to", output_file)
