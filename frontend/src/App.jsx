import { useState } from 'react';
import { globalRecipes } from './recipes';

function App() {
  // States for filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState('');

  // State for toggling instructions (stores the ID of the opened recipe)
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  // Toggle instructions open/closed
  const toggleInstructions = (id) => {
    if (expandedRecipeId === id) {
      setExpandedRecipeId(null); // Close if clicked again
    } else {
      setExpandedRecipeId(id); // Open the clicked one
    }
  };

  // Get a unique list of cuisines for the dropdown option selector
  const cuisines = [...new Set(globalRecipes.map((recipe) => recipe.cuisine))];

  // Filter recipes based on search text and cuisine selection
  const filteredRecipes = (globalRecipes || []).filter((recipe) => {
    if (!recipe || !recipe.ingredients) return false;

    // If ingredients is an array, we turn it into a string first
    const ingredientsString = Array.isArray(recipe.ingredients)
      ? recipe.ingredients.join(' ')
      : String(recipe.ingredients);

    const matchesSearch = ingredientsString.toLowerCase().includes((searchQuery || "").toLowerCase());

    const matchesCuisine = !selectedCuisine ||
      (recipe.cuisine && recipe.cuisine.toLowerCase() === selectedCuisine.toLowerCase());

    return matchesSearch && matchesCuisine;
  });

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.mainTitle}>🍳 Smart Recipe Finder</h1>
        <p style={styles.subtitle}>Filter by cuisine or ingredients, and view cooking steps instantly!</p>
      </header>

      {/* --- Filter Controls --- */}
      <div style={styles.filterSection}>
        <input
          type="text"
          placeholder="Search recipes or ingredients..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={styles.inputBar}
        />

        <select
          value={selectedCuisine}
          onChange={(e) => setSelectedCuisine(e.target.value)}
          style={styles.dropdown}
        >
          <option value="">All Cuisines</option>
          {cuisines.map((cuisine, index) => (
            <option key={index} value={cuisine}>{cuisine}</option>
          ))}
        </select>
      </div>

      {/* --- Recipe Grid Display --- */}
      <div style={styles.grid}>
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <div key={recipe.id} style={styles.card}>
              <span style={styles.badge}>{recipe.cuisine}</span>
              <h3 style={styles.recipeTitle}>{recipe.title}</h3>
              <p style={styles.metaText}>⏱️ {recipe.time} | 📊 {recipe.difficulty}</p>

              <div style={styles.ingredientsBox}>
                <strong>Ingredients:</strong>
                <p style={styles.ingredientsList}>{recipe.ingredients}</p>
              </div>

              {/* Conditional Rendering for Instructions */}
              {expandedRecipeId === recipe.id && (
                <div style={styles.instructionsBox}>
                  <strong style={{ color: '#0d47a1' }}>Preparation Steps:</strong>
                  <ol style={styles.stepsList}>
                    {recipe.instructions.map((step, idx) => (
                      <li key={idx} style={{ marginBottom: '8px' }}>{step}</li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Toggle Button */}
              <button
                onClick={() => toggleInstructions(recipe.id)}
                style={expandedRecipeId === recipe.id ? styles.hideButton : styles.viewButton}
              >
                {expandedRecipeId === recipe.id ? 'Hide Steps ▲' : 'View Steps ▼'}
              </button>
            </div>
          ))
        ) : (
          <div style={styles.noResults}>
            <h3>No recipes match your filters. Try a different ingredient!</h3>
          </div>
        )}
      </div>
    </div>
  );
}

// Clean and organized inline styling object
const styles = {
  container: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    backgroundColor: '#f4f6f8',
    minHeight: '100vh',
    padding: '40px 20px',
    boxSizing: 'border-box'
  },
  header: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  mainTitle: {
    color: '#1a1a1a',
    fontSize: '2.5rem',
    margin: '0 0 10px 0'
  },
  subtitle: {
    color: '#666',
    margin: 0
  },
  filterSection: {
    display: 'flex',
    gap: '15px',
    justifyContent: 'center',
    marginBottom: '45px',
    flexWrap: 'wrap'
  },
  inputBar: {
    padding: '12px 20px',
    width: '100%',
    maxWidth: '400px',
    borderRadius: '30px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    outline: 'none',
    boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
  },
  dropdown: {
    padding: '12px 20px',
    borderRadius: '30px',
    border: '1px solid #cbd5e1',
    fontSize: '16px',
    backgroundColor: '#fff',
    cursor: 'pointer',
    outline: 'none'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative'
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    color: '#1e40af',
    padding: '4px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    marginBottom: '12px'
  },
  recipeTitle: {
    margin: '0 0 6px 0',
    color: '#0f172a',
    fontSize: '1.3rem'
  },
  metaText: {
    fontSize: '13px',
    color: '#64748b',
    margin: '0 0 16px 0'
  },
  ingredientsBox: {
    borderTop: '1px solid #f1f5f9',
    paddingTop: '14px',
    marginBottom: '16px',
    flexGrow: 1
  },
  ingredientsList: {
    fontSize: '14px',
    color: '#334155',
    marginTop: '6px',
    lineHeight: '1.5'
  },
  instructionsBox: {
    backgroundColor: '#f8fafc',
    border: '1px dashed #cbd5e1',
    borderRadius: '8px',
    padding: '15px',
    marginBottom: '15px',
    fontSize: '14px'
  },
  stepsList: {
    paddingLeft: '20px',
    color: '#475569',
    marginTop: '8px',
    lineHeight: '1.5'
  },
  viewButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#0284c7',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  hideButton: {
    width: '100%',
    padding: '10px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#64748b',
    color: '#fff',
    fontWeight: '600',
    cursor: 'pointer'
  },
  noResults: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    color: '#94a3b8',
    padding: '40px'
  }
};

export default App;