module.exports = function (eleventyConfig) {
  // ---------------------------------------------------------------------------
  // Passthrough copy
  // ---------------------------------------------------------------------------
  eleventyConfig.addPassthroughCopy({ "src/img": "img" });
  eleventyConfig.addPassthroughCopy({ "src/js": "js" });

  // ---------------------------------------------------------------------------
  // Custom filters
  // ---------------------------------------------------------------------------

  /**
   * slugify – turns any string into a URL-safe slug.
   * Usage in templates: {{ title | slugify }}
   */
  eleventyConfig.addFilter("slugify", function (value) {
    if (!value) return "";
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s]+/g, "-")          // spaces → hyphens
      .replace(/[^\w\-]+/g, "")        // remove non-word chars (except hyphens)
      .replace(/\-\-+/g, "-")          // collapse multiple hyphens
      .replace(/^-+/, "")              // trim leading hyphens
      .replace(/-+$/, "");             // trim trailing hyphens
  });

  /**
   * dateFormat – formats a JS Date for blog post display.
   * Usage in templates: {{ date | dateFormat }}
   * Output example:    "22 March 2026"
   */
  eleventyConfig.addFilter("dateFormat", function (dateObj) {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  /**
   * dateISO – formats a date as ISO string for datetime attributes.
   */
  eleventyConfig.addFilter("dateISO", function (dateObj) {
    if (!dateObj) return "";
    return new Date(dateObj).toISOString().split("T")[0];
  });

  /**
   * dateDisplay – alias for dateFormat for template compatibility.
   */
  eleventyConfig.addFilter("dateDisplay", function (dateObj) {
    if (!dateObj) return "";
    const d = new Date(dateObj);
    return d.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  });

  // ---------------------------------------------------------------------------
  // Custom collections
  // ---------------------------------------------------------------------------

  /**
   * blogPosts – every file tagged "blogPost" under src/blog, newest first.
   */
  eleventyConfig.addCollection("blogPosts", function (collectionApi) {
    return collectionApi
      .getFilteredByTag("blogPost")
      .sort((a, b) => {
        return (b.date || 0) - (a.date || 0);
      });
  });

  // ---------------------------------------------------------------------------
  // Eleventy return config
  // ---------------------------------------------------------------------------
  return {
    dir: {
      input: "src",
      output: "dist",
      includes: "_includes",
      data: "_data",
    },
    templateFormats: ["njk", "md", "html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
  };
};
