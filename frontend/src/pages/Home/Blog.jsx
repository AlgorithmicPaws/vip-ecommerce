import { useState } from "react";
import { Link } from "react-router-dom";
const Blog = ({navigate}) => {
    // Estado para blogs/artículos
    const [blogPosts, setBlogPosts] = useState([
    {
        id: 1,
        title: "Cómo elegir la herramienta adecuada para cada trabajo",
        excerpt: "Guía completa para seleccionar herramientas que maximicen tu eficiencia y durabilidad...",
        image: null,
        date: "10 Mar 2025",
        author: "Miguel Sánchez"
    },
    {
        id: 2,
        title: "5 técnicas para optimizar el uso de materiales en construcción",
        excerpt: "Reduce costes y residuos con estas estrategias probadas por profesionales...",
        image: null,
        date: "2 Mar 2025",
        author: "Ana Martínez"
    },
    {
        id: 3,
        title: "Nuevas normativas de seguridad en obras: lo que debes saber",
        excerpt: "Actualización sobre las regulaciones que entrarán en vigor el próximo trimestre...",
        image: null,
        date: "23 Feb 2025",
        author: "Javier López"
    }
    ]);
  return (
    <section className="blog-section">
        <div className="section-header">
          <h2>Consejos y Novedades</h2>
          <Link to="/blog" className="view-all-link">Ver todos</Link>
        </div>
        <div className="blog-grid">
          {blogPosts.map(post => (
            <div key={post.id} className="blog-card" onClick={() => navigate(`/blog/${post.id}`)}>
              <div className="blog-image">
                {post.image ? (
                  <img src={post.image} alt={post.title} />
                ) : (
                  <div className="image-placeholder">
                    <span>📰</span>
                  </div>
                )}
              </div>
              <div className="blog-content">
                <div className="blog-meta">
                  <span className="blog-date">{post.date}</span>
                  <span className="blog-author">Por {post.author}</span>
                </div>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <span className="read-more">Leer más →</span>
              </div>
            </div>
          ))}
        </div>
    </section>
  );
};

export default Blog;