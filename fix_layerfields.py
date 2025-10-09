#!/usr/bin/env python3
import re

def fix_layer_fields(content):
    """
    修复layerFields位置：将其移到layerTitle之后的空行位置
    """
    lines = content.split('\n')
    new_lines = []
    i = 0

    while i < len(lines):
        line = lines[i]
        new_lines.append(line)

        # 检查是否是 layerTitle 行
        if re.match(r"^\s+layerTitle: '.*',\s*$", line):
            # 检查下一行是否是空行
            if i + 1 < len(lines) and lines[i + 1].strip() == '':
                # 跳过空行
                i += 1
                # 继续查找layerFields
                j = i + 1
                layerFields_line = None
                while j < len(lines):
                    current_line = lines[j]
                    if re.match(r'^\s+layerFields: \[.*\],\s*$', current_line):
                        layerFields_line = current_line
                        # 记下这一行要删除
                        break
                    elif re.match(r'^\s+\},\s*$', current_line):
                        # 到达对象结束，没找到layerFields
                        break
                    j += 1

                # 如果找到layerFields，添加到这里，并标记原位置要跳过
                if layerFields_line:
                    new_lines.append(layerFields_line)
                    # 标记要删除的layerFields行
                    lines[j] = '<<<DELETE>>>'

        i += 1

    # 过滤掉标记为删除的行
    new_lines = [line for line in new_lines if line != '<<<DELETE>>>']

    return '\n'.join(new_lines)

if __name__ == '__main__':
    input_file = 'src/stores/dataStore.js'

    with open(input_file, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = fix_layer_fields(content)

    with open(input_file, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print("Fixed layerFields positions")

