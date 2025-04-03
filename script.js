const dropdown = document.getElementById("language");
const btn = document.getElementById("find-repo");
const repoContainer = document.getElementById("repo-container");
const loading = document.querySelector(".loading");

btn.disabled = true; // Initially disable the button

// Fetch languages
fetch(
  "https://raw.githubusercontent.com/kamranahmedse/githunt/master/src/components/filters/language-filter/languages.json"
)
  .then((response) => response.json())
  .then((data) => {
    dropdown.innerHTML = '<option value="">Select a language</option>'; // Reset dropdown
    data.forEach((language) => {
      const option = document.createElement("option");
      option.value = language.value;
      option.textContent = language.title;
      dropdown.appendChild(option);
    });
  })
  .catch((error) => console.error("Error fetching languages:", error));

// Enable button when a valid language is selected
dropdown.addEventListener("change", function () {
  btn.disabled = !dropdown.value;
});

// Fetch a random repository
btn.addEventListener("click", () => {
  const selectedLanguage = dropdown.value;
  if (!selectedLanguage) return;

  const url = `https://api.github.com/search/repositories?q=language:${selectedLanguage}&sort=stars&order=desc&per_page=50`;

  repoContainer.innerHTML = ""; // Clear previous results
  loading.style.display = "block"; // Show loading text

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      loading.style.display = "none"; // Hide loading text

      if (!data.items || data.items.length === 0) {
        repoContainer.innerHTML = "<p>No repositories found.</p>";
        return;
      }

      const randomRepo =
        data.items[Math.floor(Math.random() * data.items.length)];

      repoContainer.innerHTML = `
                        <div class="repo-card">
                            <h3><a href="${
                              randomRepo.html_url
                            }" target="_blank">${randomRepo.name}</a></h3>
                            <p>${
                              randomRepo.description ||
                              "No description available."
                            }</p>
                            <p>⭐ Stars: ${randomRepo.stargazers_count}</p>
                        </div>
                    `;
        btn.innerText = "Refresh";
        btn.style.backgroundColor = "#8E1616"; // Change button color
    })
    .catch((error) => {
      loading.style.display = "none"; // Hide loading text
      console.error("Error fetching repositories:", error);
    });
});
