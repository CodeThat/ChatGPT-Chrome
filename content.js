// Create the button
var button = document.createElement("button");
button.textContent = "Submit File";
button.style.backgroundColor = "green";
button.style.color = "white";
button.style.padding = "5px";
button.style.border = "none";
button.style.borderRadius = "5px";
button.style.margin = "5px";

// Find the element to insert the button before
var targetElement = document.querySelector(".flex.flex-col.w-full.py-2.flex-grow.md\\:py-3.md\\:pl-4");

// Insert the button before the target element
targetElement.parentNode.insertBefore(button, targetElement);

// Create the progress element
var progressElement = document.createElement("progress");
progressElement.style.width = "99%";
progressElement.style.height = "5px";
progressElement.style.backgroundColor = "grey";

// Create the progress bar inside the progress element
var progressBar = document.createElement("div");
progressBar.style.width = "0%";
progressBar.style.height = "100%";
progressBar.style.backgroundColor = "blue";

// Insert the progress element before the target element
targetElement.parentNode.insertBefore(progressElement, targetElement);

// Insert the progress bar inside the progress element
progressElement.appendChild(progressBar);

// Function to handle file submission
async function submitFile(event) {
  // Create the file input element
  var fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = ".txt, .js, .py, .html, .css, .json, .csv";

  // Listen for file selection
  fileInput.addEventListener("change", async function (event) {
    var file = event.target.files[0];
    var filename = file.name;
    var reader = new FileReader();

    // Read the file as text
    reader.onload = async function (event) {
      var fileContent = event.target.result;
      var chunkSize = 15000;
      var numChunks = Math.ceil(fileContent.length / chunkSize);

      for (var i = 0; i < numChunks; i++) {
        var chunk = fileContent.slice(i * chunkSize, (i + 1) * chunkSize);
        await submitConversation(chunk, i + 1, filename);
        progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
      }

      progressBar.style.backgroundColor = "blue";
    };

    reader.readAsText(file);
  });

  // Trigger the file input dialog when the button is clicked
  fileInput.click();
}

// Attach the submitFile function to the button click event
button.addEventListener("click", submitFile);

// Function to submit conversation
async function submitConversation(text, part, filename) {
  const textarea = document.querySelector("textarea[tabindex='0']");
  const enterKeyEvent = new KeyboardEvent("keydown", {
    bubbles: true,
    cancelable: true,
    keyCode: 13,
  });
  textarea.value = `Part ${part} of ${filename}:\n\n${text}`;
  textarea.dispatchEvent(enterKeyEvent);
}

// Check if ChatGPT is ready
var chatgptReady = false;
async function checkChatGPTReady() {
  while (!chatgptReady) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
  }
}

checkChatGPTReady();
