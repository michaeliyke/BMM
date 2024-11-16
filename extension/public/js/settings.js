document.addEventListener('DOMContentLoaded', function () {
  // Load saved settings
  chrome.storage.sync.get(['setting1', 'setting2'], function (items) {
    document.getElementById('setting1').value = items.setting1 || '';
    document.getElementById('setting2').checked = items.setting2 || false;
  });

  // Save settings on form submit
  document.getElementById('optionsForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const setting1 = document.getElementById('setting1').value;
    const setting2 = document.getElementById('setting2').checked;
    chrome.storage.sync.set({ setting1, setting2 }, function () {
      console.log('Settings saved');
    });
  });
});

// Open the options page when the user clicks on the options link
// document.getElementById('openOptions').addEventListener('click', function () {
// chrome.runtime.openOptionsPage();
// });
