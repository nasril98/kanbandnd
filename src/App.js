import React, { useState } from "react";
import "./App.css";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { v4 as uuid } from "uuid";
import backlog from "./Data/backlog.json";
import todo from "./Data/todo.json";
import done from "./Data/done.json";
import { Modal, Button } from "react-bootstrap";

const diffDays = (date, otherDate) =>
  Math.ceil(Math.abs(date - otherDate) / (1000 * 60 * 60 * 24));
const columnsFromBackend = {
  [uuid()]: {
    name: "Backlog",
    items: backlog,
  },
  [uuid()]: {
    name: "To do",
    items: todo,
  },
  [uuid()]: {
    name: "Done",
    items: done,
  },
};

const onDragEnd = (result, taskColumns, setTaskColumns) => {
  if (!result.destination) return;
  const { source, destination } = result;
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = taskColumns[source.droppableId];
    const destColumn = taskColumns[destination.droppableId];
    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];
    const [removed] = sourceItems.splice(source.index, 1);
    destItems.splice(destination.index, 0, removed);
    setTaskColumns({
      ...taskColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

  } else {
    const column = taskColumns[source.droppableId];
    const copiedItems = [...column.items];
    const [removed] = copiedItems.splice(source.index, 1);
    copiedItems.splice(destination.index, 0, removed);
    setTaskColumns({
      ...taskColumns,
      [source.droppableId]: {
        ...column,
        items: copiedItems,
      },
    });
  }
};

function App() {
  const [showModal, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleSave = (result, taskColumns, setTaskColumns) => {
    const { source } = result;
    const sourceColumn = taskColumns[source.droppableId];
    const sourceItems = [...sourceColumn.items];
    setTaskColumns({
      ...taskColumns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
     
    });
    setShow(false)
  };
  const handleShow = (result) => {
     console.log(result);
     setShow(true);
    };
  
  const [taskColumns, setTaskColumns] = useState(columnsFromBackend);
  return (
    <div>
     <>
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>field</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    <div className="context-wrapper"> 
      <DragDropContext
        onDragEnd={(result) => onDragEnd(result, taskColumns, setTaskColumns)}
      >
        {Object.entries(taskColumns).map(([columnId, column], index) => {
          return (
            <div className="column-wrap" key={columnId}>
              <div style={{ width: "45%" }}>
                <h2>{column.name}</h2>
              </div>
              <div style={{ width: "50%", display: "inline-block" }}>
                <Button variant="primary" onClick={handleShow}>
                  Launch demo modal
                </Button>
              </div>
              <div style={{ margin: 8 }}>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <div
                        className="dropbox"
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {column.items.map((item, index) => {
                          return (
                            <Draggable
                              key={item.issued_id}
                              draggableId={item.issued_id}
                              index={index}
                            >
                              {(provided, snapshot) => {
                                return (
                                  <div
                                    className="dragbox"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div>{item.title}</div>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        width: "5%",
                                      }}
                                    >
                                      <small className="text-muted">
                                        {item.tags}
                                      </small>
                                    </div>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        width: "45%",
                                      }}
                                    >
                                      <small className="text-muted">
                                        {item.tags === "A" ? (
                                          <span
                                            style={{
                                              color: "yellow",
                                              backgroundColor: "#feeefe",
                                            }}
                                          >
                                            RESEARCH
                                          </span>
                                        ) : item.tags === "B" ? (
                                          <span
                                            style={{
                                              color: "red",
                                              backgroundColor: "pink",
                                            }}
                                          >
                                            Backend
                                          </span>
                                        ) : (
                                          <span style={{ color: "blue",backgroundColor: "magenta", }}>
                                            Design
                                          </span>
                                        )}
                                      </small>
                                    </div>
                                    <div
                                      style={{
                                        display: "inline-block",
                                        width: "50%",
                                        textAlign: "right",
                                      }}
                                    >
                                      <small className="text-muted">
                                        {diffDays(
                                          new Date(item.end_date),
                                          new Date(item.start_date)
                                        )}{" "}
                                        days
                                      </small>
                                    </div>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
    </div>
  );
}

export default App;
