import axios from 'axios';
import GeminiService from '../services/geminiService.js';

const NEWS_API_KEY = '489914255e2d4a09b6f5c7a0df15d375';

const FALLBACK_ARTICLES = [
  {
    title: "Top 5 trends for spring 2025",
    url: "https://www.vogue.co.uk/article/spring-summer-2025-fashion-trends",
    image: "https://assets.vogue.com/photos/65e5e2e2e2e2e2e2e2e2e2e2/4:3/w_1200,h_900,c_limit/vogue-trends.jpg",
    description: "Discover which clothing pieces will dominate the warm season.",
    source: "Vogue",
    publishedAt: "2025-03-01T10:00:00Z"
  },
  {
    title: "How to create an elegant summer look",
    url: "https://www.whowhatwear.com/fashion/summer/elegant-summer-style",
    image: "https://www.whowhatwear.com/images/elegant-summer-style.jpg",
    description: "Simple tricks for a light and sophisticated style.",
    source: "Who What Wear",
    publishedAt: "2025-03-02T10:00:00Z"
  },
  {
    title: "Pastel colors are making a comeback",
    url: "https://www.whowhatwear.com/fashion/outfit-ideas/how-to-wear-pastel-colors",
    image: "https://www.whowhatwear.com/images/pastel-colors.jpg",
    description: "Learn how to integrate them into your everyday outfits.",
    source: "Who What Wear",
    publishedAt: "2025-03-03T10:00:00Z"
  },
  {
    title: "How to accessorize an evening outfit",
    url: "https://www.jovani.com/blog/formal-events/how-to-accessorize-formal-evening-wear/",
    image: "https://www.jovani.com/images/accessorize-evening.jpg",
    description: "The right accessories can completely transform an outfit.",
    source: "Jovani",
    publishedAt: "2025-03-04T10:00:00Z"
  }
];

export const getFashionNews = async (req, res) => {
  try {
    // Fetch raw articles from NewsAPI
    const response = await axios.get(
      'https://newsapi.org/v2/everything',
      {
        params: {
          q: '"fashion trends" OR "style trends" OR "fashion week" OR "outfit ideas" OR "latest fashion" OR "style inspiration" OR "runway trends" OR "trend report" OR "fashion news" OR "style tips" OR "fashion industry"',
          language: 'en',
          sortBy: 'publishedAt',
          pageSize: 20, // Reduced to avoid too many API calls to Gemini
          apiKey: NEWS_API_KEY,
        }
      }
    );

    let articles = response.data.articles || [];
    
    // Use Gemini to filter articles
    if (articles.length > 0) {
      try {
        const filteredArticles = await GeminiService.filterFashionArticles(articles);
        // Attach image from original NewsAPI result if possible
        const articlesWithImages = filteredArticles.map(filtered => {
          // Try to find by url first, then by title
          const original = articles.find(a => a.url === filtered.url) || articles.find(a => a.title === filtered.title);
          return {
            ...filtered,
            image: (original && (original.urlToImage || original.image)) || 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Fashion+News'
          };
        });
        // If Gemini returns enough articles, use them
        if (articlesWithImages.length >= 4) {
          articles = articlesWithImages.slice(0, 4);
        } else {
          // If not enough, supplement with fallback articles
          const needed = 4 - articlesWithImages.length;
          const fallbackToAdd = FALLBACK_ARTICLES.slice(0, needed);
          articles = [...articlesWithImages, ...fallbackToAdd];
        }
      } catch (geminiError) {
        console.error('Gemini filtering failed, using fallback:', geminiError);
        articles = FALLBACK_ARTICLES.slice(0, 4);
      }
    } else {
      // If no articles from NewsAPI, use fallback
      articles = FALLBACK_ARTICLES.slice(0, 4);
    }

    // Ensure we always return exactly 4 articles
    articles = articles.slice(0, 4);
    
    // Add default images if missing (for fallback articles)
    articles = articles.map(article => ({
      ...article,
      image: article.image || 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Fashion+News'
    }));

    res.json({ articles });
  } catch (err) {
    console.error('Error fetching fashion news:', err.message);
    res.json({ articles: FALLBACK_ARTICLES.slice(0, 4) });
  }
}; 