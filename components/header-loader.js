/**
 * Header Loader
 * Fetches components/header.html and injects it into #global-header
 * Adjusts paths based on current location depth.
 */

document.addEventListener("DOMContentLoaded", () => {
    const headerContainer = document.getElementById("global-header");
    if (!headerContainer) return;

    // Determine depth
    // Root: /index.html or /
    // Subdir: /viz/index.html -> depth 1

    // Simple heuristic: count slashes in relative path from root? 
    // Or just check if we are in a known subdir.

    const pathname = window.location.pathname;
    let prefix = "./";

    // Check if we are in a subdirectory
    // Assuming the site is hosted at root or a subpath, we need relative nav.
    // If we are at "viz/" or "prototipo/", we need "../"

    // Better approach: calculate relative path to root based on script src?
    // Or just check if we are deep.

    // Let's assume standard structure:
    // index.html -> depth 0
    // viz/index.html -> depth 1
    // docs/file.html -> depth 1

    // We can use the fact that this script is loaded as src="..."
    // But logically, if we are in index.html, paths are "viz/...", if we are in "viz/...", paths are "../viz/..."

    // Detection logic:
    // If the page url ends with / or /index.html in the root, it's root.
    // Use document.baseURI or simply check if "../" is needed.

    // Let's determine the prefix by checking if 'components' is accessible via './components' or '../components'
    // Actually, the loader is loaded WITH the correct path by the HTML file.
    // So we know where we are relative to the root?

    // Let's deduce depth from arbitrary logic:
    // If document is in "viz" or "prototipo" folder, prefix is "../"

    const isRoot = !pathname.includes("/viz/") && !pathname.includes("/prototipo/") && !pathname.includes("/docs/") && !pathname.includes("/data/");
    const basePrefix = isRoot ? "" : "../";

    const headerPath = basePrefix + "components/header.html";

    fetch(headerPath)
        .then(response => response.text())
        .then(html => {
            headerContainer.innerHTML = html;

            // Fix links
            const links = headerContainer.querySelectorAll("cds-header-name, cds-header-nav-item");
            links.forEach(link => {
                const originalHref = link.getAttribute("href");
                if (originalHref) {
                    // Prepend prefix to all relative links
                    // If link matches "index.html" -> "../index.html"
                    link.setAttribute("href", basePrefix + originalHref);
                }
            });
        })
        .catch(err => console.error("Failed to load header:", err));
});
