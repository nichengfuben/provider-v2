import sys
from pathlib import Path

# 确保仓库根目录在 sys.path 中，便于从 src 导入
ROOT = Path(__file__).resolve().parent.parent
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))
