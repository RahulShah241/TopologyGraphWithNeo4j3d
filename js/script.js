// ----------------------------
// TASK HANDLING
// ----------------------------
const task_name = document.getElementById("task_name");
const task_hours = document.getElementById("task_hours");
const ul = document.getElementById("task_ul");
const user_task_select = document.getElementById("user_task_select");

let NODE_COUNT = 0;

// Add new task
const handleAddItem = (inputTaskName, inputTaskHours) => {
  NODE_COUNT += 1;
  const html = `
    <li class="list-group-item d-flex justify-content-between align-items-center">
        <div>${NODE_COUNT}</div>
        <div>${inputTaskHours}h</div>
        <div>${inputTaskName}</div>
        <i class="far fa-trash-alt delete"></i>
    </li>
  `;
  ul.innerHTML += html;
};

const addtask = () => {
  if (!task_hours.value || !task_name.value) return alert("Add all values");
  handleAddItem(task_name.value, task_hours.value);
};

// Remove task
ul.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
    NODE_COUNT--;
  }
});

// Clear tasks
const clearTask = () => {
  ul.innerHTML = "";
  user_task_select.value = "";
  NODE_COUNT = 0;
};

// ----------------------------
// RELATIONSHIP HANDLING
// ----------------------------
const node_id = document.getElementById("node_id");
const node_time = document.getElementById("node_time");
const start_node = document.getElementById("start_node");
const end_node = document.getElementById("end_node");

const relationshipUL = document.getElementById("relationship_ul");

const handleAddRelationship = () => {
  const html = `
    <li class="relationship-list-group-item d-flex justify-content-between align-items-center">
        <div class="relationship_list_node_id">${node_id.value}</div>
        <div class="relationship_list_node_time">${node_time.value}</div>
        <div class="relationship_list_start_node">${start_node.value}</div>
        <div class="relationship_list_end_node">${end_node.value}</div>
        <i class="far fa-trash-alt delete"></i>
    </li>
  `;
  relationshipUL.innerHTML += html;
};

const addRelationship = () => {
  if (!node_id.value || !node_time.value || !start_node.value || !end_node.value) {
    return alert("Add all values");
  }
  handleAddRelationship();
};

// Remove relationship
relationshipUL.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete")) {
    e.target.parentElement.remove();
  }
});

// Clear relationships
const clearRelationship = () => {
  relationshipUL.innerHTML = "";
};

// ----------------------------
// GRAPH CLASS FOR TOPO SORT
// ----------------------------
class Graph {
  constructor(v) {
    this.V = v;
    this.adj = new Array(this.V).fill(null).map(() => []);
  }
  addEdge(v, w) {
    if (this.adj[v]) this.adj[v].push(w);
  }
  topologicalSortUtil(v, visited, stack) {
    visited[v] = true;
    for (let i = 0; i < this.adj[v].length; i++) {
      if (!visited[this.adj[v][i]]) {
        this.topologicalSortUtil(this.adj[v][i], visited, stack);
      }
    }
    stack.push(v);
  }
  topologicalSort(taskArrTopo, resultTopo) {
    let stack = [];
    let visited = new Array(this.V).fill(false);
    for (let i = 0; i < this.V; i++) {
      if (!visited[i]) {
        this.topologicalSortUtil(i, visited, stack);
      }
    }
    while (stack.length !== 0) {
      let index = stack.pop();
      resultTopo.push({
        id: index + 1, // numeric ID
        labels: taskArrTopo[index].labels,
        properties: {
          name: taskArrTopo[index].name,
          hours: taskArrTopo[index].hours,
        },
      });
    }
  }
}

// ----------------------------
// CREATE GRAPH
// ----------------------------
const createGraph = () => {
  const taskArr = [];
  const relationshipArr = [];
  const taskArrTopo = [];
  const relationshipArrTopo = [];
  const resultTopo = [];
  const resultRelationTopo = [];

  // Collect tasks
  document.querySelectorAll(".list-group-item").forEach((item, index) => {
    const taskId = index + 1; // numeric ID
    const taskHours = item.children[1].innerText;
    const taskName = item.children[2].innerText;

    taskArr.push({
      id: taskId,
      labels: [taskName],
      properties: { name: taskName, hours: taskHours },
    });

    taskArrTopo.push({ name: taskName, hours: taskHours, labels: [taskName] });
  });

  // Collect relationships
  document.querySelectorAll(".relationship-list-group-item").forEach((item) => {
    const input_node_id = Number(item.children[0].innerText);
    const input_node_time = item.children[1].innerText;
    const input_start_node = Number(item.children[2].innerText);
    const input_end_node = Number(item.children[3].innerText);

    relationshipArr.push({
      id: String(input_node_id),
      type: input_node_time + "h",
      startNode: input_start_node,
      endNode: input_end_node,
      properties: {},
    });

    relationshipArrTopo.push({
      startNode: input_start_node - 1, // zero-based for Graph class
      endNode: input_end_node - 1,
    });
  });

  // ---------------- TOPO SORT ----------------
  if (taskArrTopo.length > 0) {
    const g = new Graph(taskArrTopo.length);
    relationshipArrTopo.forEach((item) => {
      g.addEdge(item.startNode, item.endNode);
    });
    g.topologicalSort(taskArrTopo, resultTopo);

    for (let i = 0; i < resultTopo.length - 1; i++) {
      resultRelationTopo.push({
        id: "r" + (i + 1),

        type: resultTopo[i].properties.hours,
        startNode: resultTopo[i].id,
        endNode: resultTopo[i + 1].id,
        properties: {},
      });
    }
  }

  // ---------------- RENDER ORIGINAL GRAPH ----------------
  if (taskArr.length > 0) {
    const graphData = {
      results: [
        {
          data: [
            {
              graph: {
                nodes: taskArr,
                relationships: relationshipArr,
              },
            },
          ],
        },
      ],
    };

    console.log("Graph Data for Neo4jd3:", graphData);

    new Neo4jd3("#graph", { neo4jData: graphData });
  }

  // ---------------- RENDER TOPO GRAPH ----------------
  if (resultTopo.length > 0) {
    const topoGraphData = {
      results: [
        {
          data: [
            {
              graph: {
                nodes: resultTopo,
                relationships: resultRelationTopo,
              },
            },
          ],
        },
      ],
    };

    console.log("Topo Graph Data for Neo4jd3:", topoGraphData);

    new Neo4jd3("#Tgraph", { neo4jData: topoGraphData });
  }
};
