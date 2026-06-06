import { useState } from 'react';
import { X, Plus } from 'lucide-react';

const TagInput = ({ tags = [], onChange, placeholder = 'Add skill and press Enter' }) => {
  const [input, setInput] = useState('');

  const addTag = () => {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
      setInput('');
    }
  };

  const removeTag = (tag) => {
    onChange(tags.filter((t) => t !== tag));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[2rem]">
        {tags.map((tag) => (
          <span key={tag} className="badge bg-primary-50 text-primary-700 dark:bg-primary-950/50 dark:text-primary-300 ring-1 ring-primary-200 dark:ring-primary-800 gap-1.5 pl-3">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500 transition-colors p-0.5 rounded-full hover:bg-red-50 dark:hover:bg-red-950/30">
              <X className="w-3 h-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="input-field flex-1"
        />
        <button type="button" onClick={addTag} className="btn-secondary flex items-center gap-1 flex-shrink-0">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
};

export default TagInput;
