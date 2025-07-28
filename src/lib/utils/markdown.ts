import { marked } from 'marked';

// Configure marked options for better security and rendering
marked.setOptions({
  breaks: true, // Convert \n to <br>
  gfm: true, // GitHub Flavored Markdown
});

/**
 * Renders markdown content to HTML
 * @param content - The markdown content to render
 * @returns HTML string
 */
export function renderMarkdown(content: string): string {
  try {
    const result = marked.parse(content);
    // Handle both sync and async results
    return typeof result === 'string' ? result : content.replace(/\n/g, '<br>');
  } catch (error) {
    console.error('Error parsing markdown:', error);
    // Return the original content if parsing fails
    return content.replace(/\n/g, '<br>');
  }
}

/**
 * Strips markdown formatting and returns plain text
 * @param content - The markdown content
 * @returns Plain text content
 */
export function stripMarkdown(content: string): string {
  try {
    // Use marked to parse then strip HTML tags
    const html = marked.parse(content);
    const htmlString = typeof html === 'string' ? html : content;
    return htmlString.replace(/<[^>]*>/g, '').trim();
  } catch {
    return content;
  }
}
