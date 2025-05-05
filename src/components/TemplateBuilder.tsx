import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';

interface TemplateBuilderProps {
  headers: string[];
  onComplete: (template: any) => void;
}

interface ElementStyle {
  x: number;
  y: number;
  fontSize: number;
  fontWeight: string;
  width: number;
}

interface TemplateElement {
  id: string;
  type: 'text' | 'field';
  content: string;
  style: ElementStyle;
}

type ElementUpdate = {
  style?: Partial<ElementStyle>;
  content?: string;
  type?: 'text' | 'field';
}

export default function TemplateBuilder({ headers, onComplete }: TemplateBuilderProps) {
  const [elements, setElements] = useState<TemplateElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);

  const addElement = (type: 'text' | 'field', content: string = '') => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type,
      content,
      style: {
        x: 50,
        y: 50,
        fontSize: 12,
        fontWeight: 'normal',
        width: 200,
      },
    };
    setElements([...elements, newElement]);
  };

  const updateElement = (id: string, updates: ElementUpdate) => {
    setElements(
      elements.map((el) => {
        if (el.id === id) {
          return {
            ...el,
            ...updates,
            style: updates.style ? { ...el.style, ...updates.style } : el.style,
          };
        }
        return el;
      })
    );
  };

  const removeElement = (id: string) => {
    if (id === selectedElement) {
      setSelectedElement(null);
    }
    setElements(elements.filter((el) => el.id !== id));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const draggedElement = elements.find(el => el.id === result.draggableId);
    if (!draggedElement) return;

    // Calculate new position based on drag delta
    const deltaX = result.destination.x - result.source.x;
    const deltaY = result.destination.y - result.source.y;

    updateElement(draggedElement.id, {
      style: {
        x: draggedElement.style.x + (deltaX || 0),
        y: draggedElement.style.y + (deltaY || 0),
      }
    });
  };

  const handleComplete = () => {
    onComplete({
      elements,
      pageSize: 'A4',
      orientation: 'portrait',
    });
  };

  const selectedElementData = selectedElement 
    ? elements.find((el) => el.id === selectedElement) 
    : null;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Step 2: Design PDF Template</h2>
      
      <div className="flex gap-4">
        {/* Template Canvas */}
        <div className="flex-1 border rounded-lg p-4 min-h-[842px] bg-white relative">
          {elements.map((element) => (
            <div
              key={element.id}
              className={`absolute p-2 border rounded cursor-move ${
                selectedElement === element.id
                  ? 'border-blue-500'
                  : 'border-gray-200'
              }`}
              style={{
                left: element.style.x,
                top: element.style.y,
                width: element.style.width,
                fontSize: `${element.style.fontSize}px`,
                fontWeight: element.style.fontWeight,
              }}
              onClick={() => setSelectedElement(element.id)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', element.id);
                e.dataTransfer.effectAllowed = 'move';
              }}
            >
              {element.content}
              <button
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(element.id);
                }}
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="w-64 border rounded-lg p-4">
          <div className="mb-4">
            <h3 className="font-medium mb-2">Available Fields</h3>
            <div className="space-y-2">
              {headers.map((header) => (
                <button
                  key={header}
                  className="w-full text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
                  onClick={() => addElement('field', header)}
                >
                  {header}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium mb-2">Add Text</h3>
            <button
              className="flex items-center gap-2 w-full p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded"
              onClick={() => addElement('text', 'New Text')}
            >
              <PlusIcon className="w-4 h-4" />
              Add Text Block
            </button>
          </div>

          {selectedElementData && (
            <div className="mb-4">
              <h3 className="font-medium mb-2">Element Properties</h3>
              <div className="space-y-2">
                {/* Position */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm text-gray-600">X Position</label>
                    <input
                      type="number"
                      value={selectedElementData.style.x}
                      onChange={(e) => {
                        if (selectedElement) {
                          updateElement(selectedElement, {
                            style: {
                              x: parseInt(e.target.value) || 0
                            }
                          });
                        }
                      }}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Y Position</label>
                    <input
                      type="number"
                      value={selectedElementData.style.y}
                      onChange={(e) => {
                        if (selectedElement) {
                          updateElement(selectedElement, {
                            style: {
                              y: parseInt(e.target.value) || 0
                            }
                          });
                        }
                      }}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <label className="text-sm text-gray-600">Font Size</label>
                  <input
                    type="number"
                    value={selectedElementData.style.fontSize}
                    onChange={(e) => {
                      if (selectedElement) {
                        updateElement(selectedElement, {
                          style: {
                            fontSize: parseInt(e.target.value) || 12
                          }
                        });
                      }
                    }}
                    className="w-full p-1 border rounded"
                    min="8"
                    max="72"
                  />
                </div>

                {/* Font Weight */}
                <div>
                  <label className="text-sm text-gray-600">Font Weight</label>
                  <select
                    value={selectedElementData.style.fontWeight}
                    onChange={(e) => {
                      if (selectedElement) {
                        updateElement(selectedElement, {
                          style: {
                            fontWeight: e.target.value
                          }
                        });
                      }
                    }}
                    className="w-full p-1 border rounded"
                  >
                    <option value="normal">Normal</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>

                {/* Width */}
                <div>
                  <label className="text-sm text-gray-600">Width</label>
                  <input
                    type="number"
                    value={selectedElementData.style.width}
                    onChange={(e) => {
                      if (selectedElement) {
                        updateElement(selectedElement, {
                          style: {
                            width: parseInt(e.target.value) || 100
                          }
                        });
                      }
                    }}
                    className="w-full p-1 border rounded"
                    min="50"
                    max="500"
                  />
                </div>

                {/* Content (for text elements) */}
                {selectedElementData.type === 'text' && (
                  <div>
                    <label className="text-sm text-gray-600">Text Content</label>
                    <input
                      type="text"
                      value={selectedElementData.content}
                      onChange={(e) => {
                        if (selectedElement) {
                          updateElement(selectedElement, {
                            content: e.target.value
                          });
                        }
                      }}
                      className="w-full p-1 border rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={handleComplete}
        >
          Save Template
        </button>
      </div>
    </div>
  );
} 