function getNameCollection() {
  return window.nameCollection || {};
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
  if (Object.keys(nameCollection).length === 0) {
    collectionList.innerHTML = '<p style="text-align: center; color: #999;">No names discovered yet!</p>';
    return;
  }
  
  const sortedNames = Object.entries(nameCollection).sort((a, b) => b[1] - a[1]);
  
  sortedNames.forEach(([name, count]) => {
    const item = document.createElement('div');
    item.className = 'collection-item';
    item.innerHTML = `
      <span class="collection-item-name">${name}</span>
      <span class="collection-item-count">${count} ${count === 1 ? 'time' : 'times'}</span>
    `;
    collectionList.appendChild(item);
  });
}
