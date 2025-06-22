document.write(`



<style>

 

</style>

<div class="flex-grow flex justify-center items-center" style="z-index: 10; position: fixed; left: 50%; transform: translate(-50%, 0%);">

<nav class="bg-[#eeeeee90] p-1 rounded-full flex space-x-1" style="backdrop-filter: blur(20px)">

<button class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-300 transition-colors text-sm" data-page="ai-teach.html">AI Teach</button>

<button class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-300 transition-colors text-sm" data-page="Revision.html">Revision</button>

<button class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-300 transition-colors text-sm" data-page="index.html">Home</button>

<button class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-300 transition-colors text-sm" data-page="pastpaper1.html">Past Paper</button>

<button class="px-4 py-2 rounded-full text-gray-700 hover:bg-gray-300 transition-colors text-sm" data-page="battle.html">Battle</button>

</nav>

<button class="bg-gray-200 p-2 absolute top-0 right-[-55px] rounded-full hover:bg-gray-100 transition w-[44px] h-[44px] align-center justify-items-center" data-page="account.html">

<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none"

stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"

class="text-gray-700 dark:text-gray-200">

<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />

<circle cx="12" cy="7" r="4" />

</svg>
<span style="display: none">Account</span>

</button>

</div>



`);

document.addEventListener("DOMContentLoaded", () => {
  // Map button text to their corresponding pages under /Learning/
  const pageToTabMap = {
    "ai-teach.html": "AI Teach",
    "notes.html": "Notes",
    "index.html": "Home",
    "pastpaper1.html": "Past Paper",
    "battle.html": "Battle",
      "account.html": "Account",
  };

  // Get the current path and extract the page name
  const currentPage = window.location.pathname.split("/").pop();

  // Loop through the buttons
  const buttons = document.querySelectorAll("nav button, button[data-page='account.html']"");

  buttons.forEach((button) => {
    const tabName = button.textContent.trim(); // Get button text
    const targetPage = button.getAttribute("data-page").split("/").pop(); // Get the target page name

    // Highlight the current tab
    if (currentPage === targetPage) {
      button.classList.add("bg-white", "shadow", "text-gray-900"); // Highlight selected tab
      button.classList.remove("text-gray-700", "hover:bg-gray-300"); // Remove unselected styles
    } else {
      button.classList.remove("bg-white", "shadow", "text-gray-900"); // Remove selected styles
      button.classList.add("text-gray-700", "hover:bg-gray-300"); // Add unselected styles
    }

    // Add click event listener for navigation
    button.addEventListener("click", () => {
      window.location.href = button.getAttribute("data-page"); // Redirect to the target page
    });
  });
});
