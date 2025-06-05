<template>
  <div id="design" class="design-view-wrapper d-flex flex-column vh-100">
    <div class="d-flex flex-row flex-grow-1 overflow-hidden">
      <!-- Left Panel: Tabs Navigation -->
      <div class="left-panel d-flex flex-column h-100 overflow-hidden border-end" :style="{ width: leftPanelWidthPx }">
        <div class="design-view-header pt-3 px-3 pb-2">
          <h3 class="text-primary mb-1"><i class="fas fa-palette me-2"></i>Design System</h3>
          <p class="text-muted small">Visual guide and components.</p>
        </div>
        <nav class="flex-grow-1 overflow-auto p-3">
          <div class="nav nav-pills flex-column" id="nav-tab" role="tablist">
            <button class="nav-link text-start w-100 mb-1" :class="{ active: activeTab === 'colors' }" @click="activeTab = 'colors'" type="button" role="tab" aria-controls="colors" :aria-selected="activeTab === 'colors'">顏色系統</button>
            <button class="nav-link text-start w-100 mb-1" :class="{ active: activeTab === 'typography' }" @click="activeTab = 'typography'" type="button" role="tab" aria-controls="typography" :aria-selected="activeTab === 'typography'">字體大小</button>
            <button class="nav-link text-start w-100 mb-1" :class="{ active: activeTab === 'buttons' }" @click="activeTab = 'buttons'" type="button" role="tab" aria-controls="buttons" :aria-selected="activeTab === 'buttons'">按鈕設計</button>
            <button class="nav-link text-start w-100 mb-1" :class="{ active: activeTab === 'components' }" @click="activeTab = 'components'" type="button" role="tab" aria-controls="components" :aria-selected="activeTab === 'components'">組件預覽</button>
            <hr class="my-2">
            <router-link to="/" class="nav-link text-start w-100 mb-1"><i class="fas fa-home me-2"></i>回到主頁</router-link>
          </div>
        </nav>
        <div class="p-3 mt-auto border-top">
          <small class="text-muted">Use the divider to resize panels.</small>
        </div>
      </div>

      <!-- Resizer -->
      <div class="my-resizer my-resizer-vertical" 
           :class="{ 'dragging': isDragging }"
           @mousedown="startResize"
           title="Drag to resize">
      </div>

      <!-- Right Panel: Tab Content -->
      <div class="right-panel d-flex flex-column flex-grow-1 h-100 overflow-hidden" :style="{ width: mainPanelWidthPx, 'min-width': '0px' }">
        <div class="tab-content flex-grow-1 h-100 overflow-auto p-4" id="designTabsContent">
          <!-- 顏色系統 -->
          <div class="tab-pane fade h-100" :class="{ 'show active': activeTab === 'colors' }" id="colors" role="tabpanel">
            <h2>Bootstrap 顏色系統</h2>
            <h4 class="mt-4">主要顏色</h4>
            <div class="row g-3">
              <div class="col-md-3 col-sm-6" v-for="color in primaryColors" :key="color.name">
                <div class="card h-100">
                  <div class="card-header text-center d-flex flex-column justify-content-center align-items-center" :style="{ backgroundColor: color.value, color: color.textColor, height: '120px' }">
                    <div class="fw-bold fs-5">{{ color.name }}</div>
                    <small>{{ color.value }}</small>
                  </div>
                  <div class="card-body p-2">
                    <small class="text-muted">{{ color.description }}</small>
                  </div>
                </div>
              </div>
            </div>
            <h4 class="mt-5">灰階系統</h4>
            <div class="row g-2">
              <div class="col-md-2 col-4" v-for="gray in grayColors" :key="gray.name">
                <div class="card text-center h-100">
                  <div class="card-body p-2 d-flex flex-column justify-content-center align-items-center" :style="{ backgroundColor: gray.value, color: gray.textColor }">
                    <small class="fw-bold">{{ gray.name }}</small>
                    <small>{{ gray.value }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 字體大小 -->
          <div class="tab-pane fade h-100" :class="{ 'show active': activeTab === 'typography' }" id="typography" role="tabpanel">
            <h2>字體大小系統</h2>
            <h4 class="mt-4">標題字體</h4>
            <div class="mb-3">
              <h1>H1 標題 (2.5rem / 40px)</h1>
              <h2>H2 標題 (2rem / 32px)</h2>
              <h3>H3 標題 (1.75rem / 28px)</h3>
              <h4>H4 標題 (1.5rem / 24px)</h4>
              <h5>H5 標題 (1.25rem / 20px)</h5>
              <h6>H6 標題 (1rem / 16px)</h6>
            </div>
            <h4 class="mt-4">字體粗細</h4>
            <div class="mb-3">
              <p class="fw-light">輕量字體 (300)</p>
              <p class="fw-normal">正常字體 (400)</p>
              <p class="fw-medium">中等字體 (500)</p>
              <p class="fw-bold">粗體字體 (700)</p>
            </div>
            <h4 class="mt-4">文字大小類別</h4>
            <div class="mb-3">
              <p class="fs-1">文字大小 1 (2.5rem)</p>
              <p class="fs-2">文字大小 2 (2rem)</p>
              <p class="fs-3">文字大小 3 (1.75rem)</p>
              <p class="fs-4">文字大小 4 (1.5rem)</p>
              <p class="fs-5">文字大小 5 (1.25rem)</p>
              <p class="fs-6">文字大小 6 (1rem)</p>
            </div>
          </div>

          <!-- 按鈕設計 -->
          <div class="tab-pane fade h-100" :class="{ 'show active': activeTab === 'buttons' }" id="buttons" role="tabpanel">
            <h2>按鈕設計系統</h2>
            <h4 class="mt-4">基本按鈕</h4>
            <div class="mb-3 d-flex flex-wrap gap-2">
              <button class="btn btn-primary">Primary</button>
              <button class="btn btn-secondary">Secondary</button>
              <button class="btn btn-success">Success</button>
              <button class="btn btn-danger">Danger</button>
              <button class="btn btn-warning">Warning</button>
              <button class="btn btn-info">Info</button>
              <button class="btn btn-light">Light</button>
              <button class="btn btn-dark">Dark</button>
            </div>
            <h4 class="mt-4">外框按鈕</h4>
            <div class="mb-3 d-flex flex-wrap gap-2">
              <button class="btn btn-outline-primary">Primary</button>
              <button class="btn btn-outline-secondary">Secondary</button>
              <button class="btn btn-outline-success">Success</button>
              <button class="btn btn-outline-danger">Danger</button>
              <button class="btn btn-outline-warning">Warning</button>
              <button class="btn btn-outline-info">Info</button>
              <button class="btn btn-outline-dark">Dark</button>
            </div>
            <h4 class="mt-4">按鈕大小</h4>
            <div class="mb-3 d-flex align-items-center flex-wrap gap-2">
              <button class="btn btn-primary btn-lg">大型按鈕</button>
              <button class="btn btn-primary">標準按鈕</button>
              <button class="btn btn-primary btn-sm">小型按鈕</button>
            </div>
            <h4 class="mt-4">按鈕群組</h4>
            <div class="btn-group mb-3" role="group">
              <button type="button" class="btn btn-outline-primary">左</button>
              <button type="button" class="btn btn-outline-primary">中</button>
              <button type="button" class="btn btn-outline-primary">右</button>
            </div>
          </div>

          <!-- 組件預覽 -->
          <div class="tab-pane fade h-100" :class="{ 'show active': activeTab === 'components' }" id="components" role="tabpanel">
            <h2>組件預覽</h2>
            <div class="row">
              <div class="col-md-6">
                <h4>卡片組件</h4>
                <div class="card mb-3">
                  <div class="card-header"><h5 class="card-title mb-0">卡片標題</h5></div>
                  <div class="card-body">
                    <p class="card-text">這是一個標準的 Bootstrap 卡片組件示例。</p>
                    <a href="#" class="btn btn-primary">動作按鈕</a>
                  </div>
                </div>
                <h4 class="mt-4">表單組件</h4>
                <form>
                  <div class="mb-3">
                    <label for="exampleInput" class="form-label">輸入欄位</label>
                    <input type="text" class="form-control" id="exampleInput" placeholder="請輸入文字">
                  </div>
                  <div class="mb-3">
                    <label for="exampleSelect" class="form-label">選擇清單</label>
                    <select class="form-select" id="exampleSelect">
                      <option selected>選擇選項...</option>
                      <option value="1">選項一</option><option value="2">選項二</option><option value="3">選項三</option>
                    </select>
                  </div>
                  <div class="mb-3 form-check">
                    <input type="checkbox" class="form-check-input" id="exampleCheck">
                    <label class="form-check-label" for="exampleCheck">核取方塊</label>
                  </div>
                </form>
              </div>
              <div class="col-md-6">
                <h4>提示框</h4>
                <div class="alert alert-primary" role="alert">這是一個主要提示框！</div>
                <div class="alert alert-success" role="alert">這是一個成功提示框！</div>
                <div class="alert alert-warning" role="alert">這是一個警告提示框！</div>
                <div class="alert alert-danger" role="alert">這是一個危險提示框！</div>
                <h4 class="mt-4">徽章</h4>
                <div class="mb-3 d-flex flex-wrap gap-1">
                  <span class="badge bg-primary">Primary</span><span class="badge bg-secondary">Secondary</span>
                  <span class="badge bg-success">Success</span><span class="badge bg-danger">Danger</span>
                  <span class="badge bg-warning text-dark">Warning</span><span class="badge bg-info">Info</span>
                </div>
                <h4 class="mt-4">進度條</h4>
                <div class="progress mb-2"><div class="progress-bar" style="width: 25%"></div></div>
                <div class="progress mb-2"><div class="progress-bar bg-success" style="width: 50%"></div></div>
                <div class="progress mb-2"><div class="progress-bar bg-warning" style="width: 75%"></div></div>
                <div class="progress"><div class="progress-bar bg-danger" style="width: 100%"></div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'; // Removed onMounted as it's not used for window resize yet

// Tab Management - activeTab was already here, which is good.
const activeTab = ref('colors');

const primaryColors = ref([
  { name: 'Primary', value: '#0d6efd', textColor: 'white', description: '主要品牌色' },
  { name: 'Secondary', value: '#6c757d', textColor: 'white', description: '次要顏色' },
  { name: 'Success', value: '#198754', textColor: 'white', description: '成功狀態' },
  { name: 'Danger', value: '#dc3545', textColor: 'white', description: '危險/錯誤' },
  { name: 'Warning', value: '#ffc107', textColor: 'black', description: '警告狀態' },
  { name: 'Info', value: '#0dcaf0', textColor: 'black', description: '資訊提示' }
]);

const grayColors = ref([
  { name: '100', value: '#f8f9fa', textColor: 'black' }, { name: '200', value: '#e9ecef', textColor: 'black' },
  { name: '300', value: '#dee2e6', textColor: 'black' }, { name: '400', value: '#ced4da', textColor: 'black' },
  { name: '500', value: '#adb5bd', textColor: 'black' }, { name: '600', value: '#6c757d', textColor: 'white' },
  { name: '700', value: '#495057', textColor: 'white' }, { name: '800', value: '#343a40', textColor: 'white' },
  { name: '900', value: '#212529', textColor: 'white' }
]);

// Resizable Panel Logic (Copied from ContentView, adjust as needed)
const leftPanelWidth = ref(25); // Initial width of left panel in percentage
const isDragging = ref(false);
const startX = ref(0);
const startLeftWidth = ref(0);

const leftPanelWidthPx = computed(() => `${leftPanelWidth.value}%`);
const mainPanelWidth = computed(() => 100 - leftPanelWidth.value);
const mainPanelWidthPx = computed(() => `${mainPanelWidth.value}%`);

const startResize = (event) => {
  event.preventDefault();
  isDragging.value = true;
  startX.value = event.clientX;
  startLeftWidth.value = leftPanelWidth.value;
  document.body.classList.add('my-no-select');
  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
};

const handleResize = (event) => {
  if (!isDragging.value) return;
  const deltaX = event.clientX - startX.value;
  const totalWidth = window.innerWidth; 
  const deltaPercentage = (deltaX / totalWidth) * 100;
  let newLeftWidth = startLeftWidth.value + deltaPercentage;
  newLeftWidth = Math.max(15, Math.min(newLeftWidth, 70)); 
  leftPanelWidth.value = newLeftWidth;
};

const stopResize = () => {
  if (isDragging.value) {
    isDragging.value = false;
    document.body.classList.remove('my-no-select');
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
  }
};

onUnmounted(() => {
  stopResize(); 
});

</script>

<style scoped>
.design-view-wrapper {
  font-family: 'Noto Sans TC', sans-serif;
  /* vh-100 and d-flex flex-column are on the element */
}

.left-panel {
  /* background-color: #f8f9fa; */
  transition: width 0.1s ease-out;
}

.left-panel .nav-link {
  /* Using nav-pills styling basis from Bootstrap */
  /* padding: 0.65rem 0.75rem; */ /* Adjusted by nav-pills default */
}

.left-panel .nav-link.active {
  /* Standard Bootstrap active pill styling */
}

.left-panel .nav-link:not(.active):hover {
  background-color: #e9ecef; /* Standard Bootstrap hover for non-active pills/list-groups */
}

.right-panel {
  background-color: #ffffff; /* Ensure content area has a background */
}

.tab-content {
  /* p-4 for padding is now on this element */
  /* overflow-auto is on this element to make the whole right panel content scrollable */
}

/* Individual tab-panes no longer need their own overflow or explicit height:100% if parent .tab-content handles scrolling */
.tab-pane {
   /* Removed h-100 and overflow-auto from here */
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

h1, h2, h3, h4, h5, h6 {
  color: #212529;
}

.text-muted {
  color: #6c757d !important;
}

/* Resizer styles are global */
</style> 