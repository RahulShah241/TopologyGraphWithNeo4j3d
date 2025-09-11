# TopologyGraphWithNeo4j3d

A dynamic **task and relationship visualization tool** using **Neo4jd3** and **D3.js**.  
This project allows you to **create tasks**, define **dependencies**, and visualize both the **original task graph** and a **topologically sorted graph** with **custom node labels**.

---

## 🚀 Features

- **Add Tasks** with:
  - Name
  - Duration (Hours)
  - Custom Node Label (e.g., `"premixing"`, `"user"`)  
- **Add Relationships** between tasks (start node → end node).  
- **Visualize Graphs**:
  - Original task graph  
  - Topologically sorted graph based on dependencies  
- **Interactive UI**:
  - Delete tasks or relationships  
  - Clear all tasks or relationships  
- **Topological Sorting** implemented in JavaScript using a custom Graph class.  
- **Neo4jd3 Integration**:
  - Nodes display **custom labels**  
  - Relationships show task duration  

---

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, Bootstrap 5  
- **Visualization**: D3.js, Neo4jd3  
- **JavaScript**: ES6 for UI, graph handling, and topological sorting  

---

## 📌 How It Works

1. **Add Tasks** via the Task Input form (Name, Hours, Label).  
2. **Define Relationships** using the Relationship Input form (Start Node → End Node).  
3. Click **Create Graph** to render:
   - Original graph  
   - Topologically sorted graph  
4. Nodes display **custom labels**, and edges show task hours.  

