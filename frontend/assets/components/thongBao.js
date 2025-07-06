// notification.js

// Tạo HTML và CSS bằng JavaScript
const templateHTML = `
  <style>
    .notification {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #333;
      color: white;
      padding: 20px 30px;
      border-radius: 10px;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      transition: opacity 0.3s ease;
    }

    .notification.hidden {
      display: none;
    }

    .notification .close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 20px;
      cursor: pointer;
    }
      #notification-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0,0,0,0.3); /* mờ nền */
        z-index: 9998;
        display: none;
        }
    .notification.error {
      background-color: #e74c3c; /* đỏ */
    }

    .notification.success {
      background-color: #2ecc71; /* xanh lá */
    }

    .notification.warning {
      background-color: #f39c12; /* vàng cam */
    }

  </style>

  <div class="notification hidden" id="global-notification">
    <span id="notification-message"></span>
    <button class="close-btn" id="notification-close">&times;</button>
  </div>
`;

// Inject vào DOM nếu chưa có
if (!document.getElementById('global-notification')) {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = templateHTML;
  document.body.appendChild(wrapper);
}
// Tạo overlay nếu chưa có
if (!document.getElementById('notification-overlay')) {
  const overlay = document.createElement('div');
  overlay.id = 'notification-overlay';
  document.body.appendChild(overlay);
}
const notif = document.getElementById('global-notification');
const overlay = document.getElementById('notification-overlay');
const messageSpan = document.getElementById('notification-message');
const closeBtn = document.getElementById('notification-close');
let timer = null;

closeBtn.addEventListener('click', hideNotification);
overlay.addEventListener('click', hideNotification);
closeBtn.hidden = true;
function hideNotification() {
  notif.classList.add('hidden');
  overlay.style.display = 'none';
}


function thongBao_error(message, duration, type = "default") {
  messageSpan.textContent = message;

  // Reset class
  notif.className = "notification";
  if (type) notif.classList.add(type); // thêm lớp error / success / warning
  notif.classList.remove("hidden");

  overlay.style.display = "block";

  if (timer) clearTimeout(timer);

  if (typeof duration === 'number') {
    timer = setTimeout(hideNotification, duration);
  }
}

function thongBao_xemThongTin(message, duration, type = "default") {
  messageSpan.textContent = message;

  // Reset class
  notif.className = "notification";
  if (type) notif.classList.add(type); // thêm lớp error / success / warning
  notif.classList.remove("hidden");

  overlay.style.display = "block";

  if (timer) clearTimeout(timer);

  if (typeof duration === 'number') {
    timer = setTimeout(hideNotification, duration);
  }
}

// Export cho ES module
export default {
  thongBao_error,
  thongBao_xemThongTin
};