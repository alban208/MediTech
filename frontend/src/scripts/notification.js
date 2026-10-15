const containerId = "notification-container";


function getContainer() {
  let container = document.getElementById(containerId);
  if (!container) {
    container = document.createElement("div");
    container.id = containerId;
    container.style.position = "fixed";
    container.style.top = "20px";
    container.style.right = "20px";
    container.style.zIndex = "9999";
    container.style.display = "flex";
    container.style.flexDirection = "column";
    container.style.gap = "10px";
    document.body.appendChild(container);
  }
  return container;
}

function showNotification(message, type = "success", duration = 4000) {
  const container = getContainer();
  const notif = document.createElement("div");
  notif.innerText = message;
  notif.style.padding = "10px 20px";
  notif.style.borderRadius = "5px";
  notif.style.color = "#fff";
  notif.style.fontWeight = "bold";
  notif.style.boxShadow = "0 2px 6px rgba(0,0,0,0.2)";
  notif.style.transition = "opacity 0.3s";
  notif.style.opacity = "1";

  if (type === "success") {
    notif.style.backgroundColor = "#2196f3"; 
  } else if (type === "error") {
    notif.style.backgroundColor = "#f44336"; 
  }

  container.appendChild(notif);

  setTimeout(() => {
    notif.style.opacity = "0";
    setTimeout(() => container.removeChild(notif), 300);
  }, duration);
}


export const notifySuccess = (msg, duration) => showNotification(msg, "success", duration);
export const notifyError = (msg, duration) => showNotification(msg, "error", duration);
