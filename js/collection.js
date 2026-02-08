function getNameCollection() {
  return window.nameCollection || {};
}

function getNamePoints() {
  return window.namePoints || {};
}

// Collection modal
const modal = document.getElementById('collectionModal');
const closeBtn = document.querySelector('.close');
const collectionBtn = document.getElementById('collectionBtn');

if (collectionBtn) {
  collectionBtn.addEventListener('click', openCollection);
}

if (closeBtn) {
  closeBtn.addEventListener('click', closeCollection);
}

window.addEventListener('click', (e) => {
  if (e.target === modal) {
    closeCollection();
  }
});

function openCollection() {
  modal.style.display = 'block';
  updateCollectionDisplay();
}

function closeCollection() {
  modal.style.display = 'none';
}

function updateCollectionDisplay() {
  const collectionList = document.getElementById('collectionList');
  collectionList.innerHTML = '';

  const nameCollection = getNameCollection();
  const namePoints = getNamePoints();
  if (Object.keys(nameCollection).length === 0) {
    collectionList.innerHTML = '<p style="text-align: center; color: #999;">No names discovered yet!</p>';
    return;
  }
  
  const sortedNames = Object.entries(nameCollection).sort((a, b) => b[1] - a[1]);
  
  sortedNames.forEach(([name, count]) => {
    const points = namePoints[name] || 0;
    const item = document.createElement('div');
    item.className = 'collection-item';
    item.innerHTML = `
      <span class="collection-item-name">${name}</span>
      <span class="collection-item-count">Clicks: ${count} · Points: ${points}</span>
    `;
    collectionList.appendChild(item);
  });
}
