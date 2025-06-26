import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, ChevronUp } from "lucide-react";
import "./MultiSelect.scss";

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  allowCustom?: boolean;
}

export function MultiSelect({
  options: initialOptions,
  value,
  onChange,
  placeholder = "Select...",
  allowCustom = true,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<MultiSelectOption[]>(initialOptions);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(inputValue.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) setHighlightedIndex(-1);
  }, [isOpen, filteredOptions.length]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && dropdownRef.current) {
      const highlightedElement = dropdownRef.current.children[
        highlightedIndex
      ] as HTMLElement;
      if (highlightedElement) {
        highlightedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [highlightedIndex, isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setIsOpen(true);
  };

  const handleSelect = (option: MultiSelectOption) => {
    const isSelected = value.some((v) => v.value === option.value);
    if (isSelected) {
      onChange(value.filter((v) => v.value !== option.value));
    } else {
      onChange([...value, option]);
    }
    setInputValue("");
  };

  const handleRemove = (option: MultiSelectOption) => {
    onChange(value.filter((v) => v.value !== option.value));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => {
        const next = prev + 1;
        return next >= filteredOptions.length ? 0 : next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
      setHighlightedIndex((prev) => {
        const next = prev - 1;
        return next < 0 ? filteredOptions.length - 1 : next;
      });
    } else if (e.key === "Enter") {
      if (
        isOpen &&
        highlightedIndex >= 0 &&
        highlightedIndex < filteredOptions.length
      ) {
        handleSelect(filteredOptions[highlightedIndex]);
      } else if (e.currentTarget.value.trim() && allowCustom) {
        const exists = options.some(
          (opt) => opt.label.toLowerCase() === inputValue.trim().toLowerCase()
        );
        if (!exists) {
          const newOption = {
            label: inputValue.trim(),
            value: inputValue.trim(),
          };
          setOptions([...options, newOption]);
          onChange([...value, newOption]);
          setInputValue("");
          setIsOpen(false);
        }
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="multi-select-container" ref={containerRef}>
      <div
        className="multi-select-input-wrapper"
        onClick={() => setIsOpen(true)}
      >
        {value.map((selected) => (
          <span className="multi-select-tag" key={selected.value}>
            {selected.label}
            <button
              className="multi-select-remove"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove(selected);
              }}
            >
              &times;
            </button>
          </span>
        ))}
        <input
          className="multi-select-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <span
          className={`multi-select-arrow${isOpen ? " open" : ""}`}
          aria-hidden="true"
        >
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </div>
      {isOpen && (
        <div className="multi-select-dropdown" ref={dropdownRef}>
          {filteredOptions.length === 0 && inputValue.trim() && allowCustom ? (
            <div className="multi-select-option multi-select-new">
              Press Enter to add "{inputValue}"
            </div>
          ) : (
            filteredOptions.map((option, idx) => {
              const isSelected = value.some((v) => v.value === option.value);
              return (
                <div
                  className={`multi-select-option${
                    idx === highlightedIndex ? " highlighted" : ""
                  }${isSelected ? " selected" : ""}`}
                  key={option.value}
                  onClick={() => handleSelect(option)}
                  onMouseEnter={() => setHighlightedIndex(idx)}
                >
                  {option.label}
                  {isSelected && (
                    <span className="multi-select-checkmark">
                      <Check size={16} />
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
