<template>
  <div id="design" class="container-fluid p-4">
    <div class="row">
      <div class="col-12">
        <nav class="mb-4">
          <div class="nav nav-tabs" id="nav-tab" role="tablist">
            <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#colors" type="button">顏色系統</button>
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#typography" type="button">字體大小</button>
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#buttons" type="button">按鈕設計</button>
            <button class="nav-link" data-bs-toggle="tab" data-bs-target="#components" type="button">組件預覽</button>
            <router-link to="/" class="nav-link">回到主頁</router-link>
          </div>
        </nav>

        <div class="tab-content">
          <!-- 顏色系統 -->
          <div class="tab-pane fade show active" id="colors">
            <h2>Bootstrap 顏色系統</h2>
            
            <h4 class="mt-4">主要顏色</h4>
            <div class="row g-3">
              <div class="col-md-2" v-for="color in primaryColors" :key="color.name">
                <div class="card h-100">
                  <div class="card-header text-center" :style="{ backgroundColor: color.value, color: color.textColor, height: '100px' }">
                    <div class="fw-bold">{{ color.name }}</div>
                    <small>{{ color.value }}</small>
                  </div>
                  <div class="card-body p-2">
                    <small class="text-muted">{{ color.description }}</small>
                  </div>
                </div>
              </div>
            </div>

            <h4 class="mt-4">灰階系統</h4>
            <div class="row g-2">
              <div class="col-md-1" v-for="gray in grayColors" :key="gray.name">
                <div class="card text-center">
                  <div class="card-body p-2" :style="{ backgroundColor: gray.value, color: gray.textColor }">
                    <small class="fw-bold">{{ gray.name }}</small>
                    <br>
                    <small>{{ gray.value }}</small>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 字體大小 -->
          <div class="tab-pane fade" id="typography">
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
          <div class="tab-pane fade" id="buttons">
            <h2>按鈕設計系統</h2>
            
            <h4 class="mt-4">基本按鈕</h4>
            <div class="mb-3">
              <button class="btn btn-primary me-2">Primary</button>
              <button class="btn btn-secondary me-2">Secondary</button>
              <button class="btn btn-success me-2">Success</button>
              <button class="btn btn-danger me-2">Danger</button>
              <button class="btn btn-warning me-2">Warning</button>
              <button class="btn btn-info me-2">Info</button>
              <button class="btn btn-light me-2">Light</button>
              <button class="btn btn-dark me-2">Dark</button>
            </div>

            <h4 class="mt-4">外框按鈕</h4>
            <div class="mb-3">
              <button class="btn btn-outline-primary me-2">Primary</button>
              <button class="btn btn-outline-secondary me-2">Secondary</button>
              <button class="btn btn-outline-success me-2">Success</button>
              <button class="btn btn-outline-danger me-2">Danger</button>
              <button class="btn btn-outline-warning me-2">Warning</button>
              <button class="btn btn-outline-info me-2">Info</button>
              <button class="btn btn-outline-dark me-2">Dark</button>
            </div>

            <h4 class="mt-4">按鈕大小</h4>
            <div class="mb-3">
              <button class="btn btn-primary btn-lg me-2">大型按鈕</button>
              <button class="btn btn-primary me-2">標準按鈕</button>
              <button class="btn btn-primary btn-sm me-2">小型按鈕</button>
            </div>

            <h4 class="mt-4">按鈕群組</h4>
            <div class="btn-group mb-3" role="group">
              <button type="button" class="btn btn-outline-primary">左</button>
              <button type="button" class="btn btn-outline-primary">中</button>
              <button type="button" class="btn btn-outline-primary">右</button>
            </div>
          </div>

          <!-- 組件預覽 -->
          <div class="tab-pane fade" id="components">
            <h2>組件預覽</h2>
            
            <div class="row">
              <div class="col-md-6">
                <h4>卡片組件</h4>
                <div class="card">
                  <div class="card-header">
                    <h5 class="card-title mb-0">卡片標題</h5>
                  </div>
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
                      <option value="1">選項一</option>
                      <option value="2">選項二</option>
                      <option value="3">選項三</option>
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
                <div class="alert alert-primary" role="alert">
                  這是一個主要提示框！
                </div>
                <div class="alert alert-success" role="alert">
                  這是一個成功提示框！
                </div>
                <div class="alert alert-warning" role="alert">
                  這是一個警告提示框！
                </div>
                <div class="alert alert-danger" role="alert">
                  這是一個危險提示框！
                </div>

                <h4 class="mt-4">徽章</h4>
                <div class="mb-3">
                  <span class="badge bg-primary me-2">Primary</span>
                  <span class="badge bg-secondary me-2">Secondary</span>
                  <span class="badge bg-success me-2">Success</span>
                  <span class="badge bg-danger me-2">Danger</span>
                  <span class="badge bg-warning text-dark me-2">Warning</span>
                  <span class="badge bg-info me-2">Info</span>
                </div>

                <h4 class="mt-4">進度條</h4>
                <div class="progress mb-2">
                  <div class="progress-bar" style="width: 25%"></div>
                </div>
                <div class="progress mb-2">
                  <div class="progress-bar bg-success" style="width: 50%"></div>
                </div>
                <div class="progress mb-2">
                  <div class="progress-bar bg-warning" style="width: 75%"></div>
                </div>
                <div class="progress">
                  <div class="progress-bar bg-danger" style="width: 100%"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'DesignView',
  setup() {
    const primaryColors = ref([
      { name: 'Primary', value: '#0d6efd', textColor: 'white', description: '主要品牌色' },
      { name: 'Secondary', value: '#6c757d', textColor: 'white', description: '次要顏色' },
      { name: 'Success', value: '#198754', textColor: 'white', description: '成功狀態' },
      { name: 'Danger', value: '#dc3545', textColor: 'white', description: '危險/錯誤' },
      { name: 'Warning', value: '#ffc107', textColor: 'black', description: '警告狀態' },
      { name: 'Info', value: '#0dcaf0', textColor: 'black', description: '資訊提示' }
    ])

    const grayColors = ref([
      { name: '100', value: '#f8f9fa', textColor: 'black' },
      { name: '200', value: '#e9ecef', textColor: 'black' },
      { name: '300', value: '#dee2e6', textColor: 'black' },
      { name: '400', value: '#ced4da', textColor: 'black' },
      { name: '500', value: '#adb5bd', textColor: 'black' },
      { name: '600', value: '#6c757d', textColor: 'white' },
      { name: '700', value: '#495057', textColor: 'white' },
      { name: '800', value: '#343a40', textColor: 'white' },
      { name: '900', value: '#212529', textColor: 'white' }
    ])

    // onMounted(() => {
    //   // 初始化 Bootstrap tabs
    //   const triggerTabList = document.querySelectorAll('#nav-tab button')
    //   triggerTabList.forEach(triggerEl => {
    //     triggerEl.addEventListener('click', (event) => {
    //       // 移除所有 active 類別
    //       triggerTabList.forEach(tab => tab.classList.remove('active'))
    //       document.querySelectorAll('.tab-pane').forEach(pane => {
    //         pane.classList.remove('show', 'active')
    //       })
          
    //       // 添加 active 類別到點擊的 tab
    //       event.target.classList.add('active')
    //       const targetPane = document.querySelector(event.target.dataset.bsTarget)
    //       if (targetPane) {
    //         targetPane.classList.add('show', 'active')
    //       }
    //     })
    //   })
    // })

    return {
      primaryColors,
      grayColors
    }
  }
}
</script>

<style scoped>
#design {
  font-family: 'Noto Sans TC', sans-serif;
  min-height: 100vh;
  background-color: #f8f9fa;
}

.card {
  box-shadow: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
  border: 1px solid rgba(0, 0, 0, 0.125);
}

.nav-tabs .nav-link {
  border: 1px solid transparent;
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
}

.nav-tabs .nav-link.active {
  color: #495057;
  background-color: #fff;
  border-color: #dee2e6 #dee2e6 #fff;
}

.btn:hover {
  transform: translateY(-1px);
  transition: transform 0.2s ease;
}

h1, h2, h3, h4, h5, h6 {
  color: #212529;
}

.text-muted {
  color: #6c757d !important;
}
</style> 