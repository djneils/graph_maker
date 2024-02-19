let mode = 1
let currentNodeName = 'A';
let currentNodeIndex = 0
let currentNodeNameRow = 0
let toggleSwitches = []; // Add this at the global level

let nodeNames = [
  ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99']
];

let weightLock = false
let gridLines = false
let dataMode = true
let graphLoaded = false
let scaleFactor = 1
let eGraph
let graph
let menuDiv, instructionDiv
let instructionShow = false
let modeTextShow = true
let snapMode = false
let lineMode = false
// Global variables to store alignment info
let drawVLine = false;
let drawHLine = false;
let linePosX = 0;
let linePosY = 0;
//neighbourInfoShow=false
// Global variables to store alignment info

let showSettings = false;
let appState
let graphMover,tableMover
function setup() {


  createCanvas(windowWidth, windowHeight);
  eGraph = new EditGraph();
  graph = new ViewerGraph();
  textSize(40);
  textAlign(CENTER, CENTER);

  let settingsPanel = select('#settingsPanel');
  settingsPanel.mousePressed((e) => {
    e.preventDefault();
    e.stopPropagation();
  });
  select('#settingsPanel').hide(); // Initially hide the settings panel
  appState = {
    weightLock: false,
    lineMode: false,
    snapMode: false,
    grid: false,
    neighbourInfoShow: false,
    dataMode: true,
    modeTextShow: true,
    scaleFactor:1,
    movementControls:false
  };
  addEditButtonsToPanel()
  toggleSettingsPanel()
  tableMover = new MovementControl(120, height-110,1)
  graphMover = new MovementControl(10, height-110,0)
  //instructionDiv = createDiv()
}

function draw() {

  background(200)

  if (mode == 1) {

    editor()
  } else if (mode == 2) {
    viewer()
  }

  if(appState.movementControls){
    if(mode==2 && appState.dataMode && graph.algorithmState ==1){
       tableMover.display()
    }
    graphMover.display()
   
  }
}




function removeAllButtons() {
  const toggleContainers = selectAll('.toggle-container');
  const actionContainers = selectAll('.action-container');
  const changeContainers = selectAll('.change-button-container')
  const textContainers = selectAll('.text-field-container')
  
  toggleContainers.forEach(container => container.remove());
  actionContainers.forEach(container => container.remove());
    changeContainers.forEach(container => container.remove());
  textContainers.forEach(container => container.remove());
  // Clear the arrays holding references to the toggle switches and action buttons
  toggleSwitches = [];
}

function addEditButtonsToPanel() {
  // Assuming appState is correctly initialized and accessible here
  new TextField('Editor Controls');
  new ActionButton('Go to Viewer Mode', changeModes)
  new ToggleSwitch('Weight Lock', 'weightLock', appState);
  new ToggleSwitch('Line Mode', 'lineMode', appState);
  new ToggleSwitch('Snap Mode', 'snapMode', appState);
  new ToggleSwitch('Grid Lines', 'grid', appState);
  new ToggleSwitch('On Screen Text', 'modeTextShow', appState);
   new ToggleSwitch('Movement Controls', 'movementControls', appState);
  // Additional action buttons...
  new ActionButton('Reset', clearGraph);
  new ActionButton('Load Graph', loadFromFile)
  new ActionButton('Save Graph', saveToFile)
  new ActionButton('Make Grid', makeAGrid)
  new ActionButton('Randomise Weights', randomiseWeights)
  new ActionButton('Save Graph as Image', saveCanvasWithPrompt)
  new ActionButton('Set Next Node Name', setNewNodeName)
  new ActionButton('Rename Selected Node', renameNode)
  new ActionButton('Delete Selected Node', deleteNode)
  new ActionButton('Set Selected Node as Start', setStartNode)
  new ActionButton('Set Selected Node as End', setEndNode)

}
function addViewerButtonsToPanel() {
  new TextField('Viewer Controls');
  new ActionButton('Go to Editor Mode', changeModes)
  new ToggleSwitch('Neighbour Info', 'neighbourInfoShow', appState);
  new ToggleSwitch('Data Table Show', 'dataMode', appState);
  new ToggleSwitch('On Screen Text', 'modeTextShow', appState);
   new ToggleSwitch('Movement Controls', 'movementControls', appState);
  new ActionButton('Load Graph From File', loadFromFile)
  new ActionButton('Load Graph From Editor', loadFromEditor)
  new ActionButton('Save Graph as Image', saveCanvasWithPrompt)
  new ChangeButton("Zoom Level", increaseZoom, decreaseZoom, "+", "-");
  if(graph.algorithmState == 1){
   new ChangeButton("Step Forward or Back",  backwardStep,forwardStep, ">", "<");
  }

}

function deleteNode(){
  eGraph.removeNode(eGraph.selectedNode);
  eGraph.selectedNode = null; // Deselect the node after removal
}
function setStartNode(){
  let selectedNode = eGraph.nodes.find(node =>
    node.selected==true);
   eGraph.setStartNode(selectedNode);
  eGraph.selectedNode = null
  eGraph.deselectNode()
}
function setEndNode(){
  let selectedNode = eGraph.nodes.find(node =>
    node.selected==true);
   eGraph.setEndNode(selectedNode);
  eGraph.selectedNode = null
  eGraph.deselectNode()
}

function changeModes(){
  if (mode == 1) {
    mode = 2
    removeAllButtons()
    addViewerButtonsToPanel()
    // instructionDiv.hide()
    // menuDiv.show()
    // menuDiv.html(`<h3>VIEWER MODE</h3>
    //              <p>Press Space to Load Graph</p>
    //              <p>Press M to Change to Editor Mode</p>
    //              `)
    // setTimeout(function() {
    //   menuDiv.hide()
    // }, 2000)
  } else {
    removeAllButtons()
    addEditButtonsToPanel()
    // menuDiv.show()
    // instructionDiv.hide()
    // menuDiv.html(`<h3>EDITOR MODE</h3>
    // <p>Click to add nodes</p>
    // <p>Press M to Change to Editor Mode</p>`)
    // setTimeout(function() {
    //   menuDiv.hide()
    // }, 2000)
    mode = 1

  }
}



function randomiseWeights() {
  eGraph.randomizeWeights(prompt('Enter Min') * 1, prompt('Enter Max') * 1)
}
function loadFromEditor() {
  let transferData = serializeGraph(eGraph)
  graph.clearGraph();


  graph = deserializeGraph(transferData);

  graphLoaded = true;
  resetGraphState(); // Reset other graph-r
}
function updateToggleSwitches() {
  toggleSwitches.forEach(toggleSwitch => {
    // Update the state of the toggle switch based on appState
    toggleSwitch.state = toggleSwitch.appState[toggleSwitch.stateKey];
    toggleSwitch.updateSwitchState(); // Reflect this new state visually
  });
}

function loadFromFile() {
  document.getElementById('fileInput').click();
}
function saveToFile() {
  const graphData = serializeGraph(eGraph);
  const fileName = prompt('Enter Filename to save as')
  save(graphData, fileName + '.json');
}
function makeAGrid() {
  let numberOfNodes = prompt('HOW MANY NODES IN GRID?')
  let spacing = prompt('SPACING?') * 1
  let weight = prompt('WEIGHT') * 1


  eGraph.makeGrid(parseInt(numberOfNodes), spacing, 100, 100, weight)
}

function setNewNodeName() {
  let newName = prompt('Enter Node Label')
  if(newName.length == 1 && nodeNames[0].indexOf(newName)!=-1){
    currentNodeIndex = nodeNames[0].indexOf(newName)
    console.log(currentNodeIndex)
  }
 
}


function clearGraph() {
  eGraph.clearGraph()
  currentNodeName = 'A'
  currentNodeIndex = 0
}

function keyReleased() {
  // if (mode == 1) {
  //   if (keyCode === SHIFT) {
  //     eGraph.deselectNode();
  //   }
  // }

}

function mousePressed() {

  if (mode == 1 && instructionShow == false) {

    let mousePos = createVector(mouseX, mouseY);
    let onNode = false; // Flag to track if the click is on an existing node
    let handledWeightLabelClick = false; // Flag to indicate a weight label click has been handled

    // Loop through all nodes and their connections
    eGraph.nodes.forEach(node => {
      node.connections.forEach((connection, index) => {
        const midPoint = createVector(
          (node.position.x + connection.node.position.x) / 2,
          (node.position.y + connection.node.position.y) / 2
        );

        // Check if the click is close to the midpoint of the connection
        if (mousePos.dist(midPoint) < 20) {
          // If Shift is held, delete the connection
          if (keyIsDown(SHIFT)) {
            node.removeConnection(connection.node);
            handledWeightLabelClick = true;
            // Ensure the graph is updated to reflect the deletion
            eGraph.display();
            return; // Exit the connections loop
          } else if (!window.weightUpdateInProgress) {
            // Handle weight update only if not currently updating another weight
            window.weightUpdateInProgress = true;
            const newWeight = prompt("Enter new weight:", connection.weight);
            if (newWeight !== null && !isNaN(newWeight) && newWeight.trim() !== '') {
              const weight = parseFloat(newWeight.trim());
              connection.weight = weight;
              // Also update the reciprocal connection weight
              const reciprocalConnection = connection.node.connections.find(conn => conn.node === node);
              if (reciprocalConnection) {
                reciprocalConnection.weight = weight;
              }
              // Recalculate paths if Dijkstra's results are displayed
              if (eGraph.dijkstraResults) {
                eGraph.runDijkstra();
              }
              eGraph.display(); // Refresh display to show updated weights
            }
            setTimeout(() => window.weightUpdateInProgress = false, 100); // Allow for weight updating again after prompt
            handledWeightLabelClick = true;
            return; // Exit the connections loop
          }
        }
      });

      if (handledWeightLabelClick) {
        return; // Exit the nodes loop if we handled a weight label click
      }

      // Node selection or dragging logic
      if (!handledWeightLabelClick && dist(mousePos.x, mousePos.y, node.position.x, node.position.y) < 50) {
        onNode = true; // Mark that we've clicked on a node

        if (keyIsDown(SHIFT)) {
          // Select the node for potential connection
          if (eGraph.selectedNode && eGraph.selectedNode !== node) {
            eGraph.selectedNode.connect(node);
            eGraph.deselectNode(); // Deselect node after connecting
          } else {
            eGraph.selectNode(node);
          }
        } else {
          // Prepare to drag the node
          eGraph.draggedNode = node;
        }
        return; // Exit the nodes loop since we've processed a node
      }
    });

    // Adding a new node logic
    let overMoveUI =false
    if(mouseX>0 && mouseX<120 && mouseY>height-130 && mouseY<height){
      overMoveUI=true
    }
    if (!onNode && !handledWeightLabelClick && !keyIsDown(SHIFT) && !overMoveUI) {
      //eGraph.addNode(currentNodeName, mousePos);
      eGraph.addNode(nodeNames[currentNodeNameRow][currentNodeIndex], mousePos);
      eGraph.deselectNode()
      // Increment the node name for the next node
      //currentNodeName = String.fromCharCode(currentNodeName.charCodeAt(0) + 1);
      currentNodeIndex+=1
      if(currentNodeIndex>nodeNames[0].length-1){
        currentNodeIndex=0
        currentNodeNameRow=1
      }
    }
  }
  if (mode == 2) {
    let mousePos = createVector(mouseX / scaleFactor, mouseY / scaleFactor);
    let clickedNode = null;

    // Check if any node was clicked
    graph.nodes.forEach(node => {
      if (dist(mousePos.x, mousePos.y, node.position.x, node.position.y) < 50 * scaleFactor) {
        clickedNode = node;
      }
    });

    if (clickedNode) {
      if (keyIsDown(SHIFT)) {
        // If shift is held, set the clicked node as the end node and highlight the path
        graph.setEndNode(clickedNode);
        //graph.displayPath(); // Assuming this method calculates and visually highlights the path
      } else {
        // Regular click behavior (e.g., setting as start node)
        graph.setStartNode(clickedNode);
        graph.initializeDijkstra(clickedNode.value);
      }
    }
  }
}

function mouseDragged() {
  if (mode == 1 && eGraph.draggedNode) {
    let newPos = createVector(mouseX, mouseY);

    // Reset alignment line flags
    drawVLine = drawHLine = false;

    eGraph.nodes.forEach(node => {
      if (node !== eGraph.draggedNode) {
        // Check for vertical alignment within 10 pixels
        if (abs(newPos.x - node.position.x) < 4) {
          drawVLine = true; // Mark to draw a vertical line
          linePosX = node.position.x; // Set X position for the vertical line
        }
        // Check for horizontal alignment within 10 pixels
        if (abs(newPos.y - node.position.y) < 4) {
          drawHLine = true; // Mark to draw a horizontal line
          linePosY = node.position.y; // Set Y position for the horizontal line
        }
      }
    });

    // Proceed with dragging the node
    // Check if the new position is not on top of another node
    if (!isCloseToNode(newPos, 80) || dist(newPos.x, newPos.y, eGraph.draggedNode.position.x, eGraph.draggedNode.position.y) < 80) {
      eGraph.deselectNode()
      if (appState.snapMode) {
        eGraph.draggedNode.position.x = floor((newPos.x) / 26) * 26;
        eGraph.draggedNode.position.y = floor((newPos.y) / 26) * 26
      } else {
        eGraph.draggedNode.position.x = newPos.x;
        eGraph.draggedNode.position.y = newPos.y;
      }


      // After moving the node, update the weights for its connections if not locked
      if (!appState.weightLock) {
        updateConnectionWeights(eGraph.draggedNode);
      }
    }
  }
}

function keyPressed() {
  if (keyCode == 32) {
    toggleSettingsPanel()
  }

  if (mode == 2) {
    if (key == 'v' && eGraph.nodes.length > 0) {

      loadFromEditor()

    }
  }
 
  if (key == 'm') {
    changeModes()
  }
  if (mode == 1) {

    if (key == 'l' && !keyIsDown(SHIFT)) {
      setNewNodeName()

      return
    }

    if (key == 'w' || key == 'W') {
      appState.weightLock = !appState.weightLock
      updateToggleSwitches()
    }

    if (key === 'D' || key === 'd') {
      if (eGraph.dijkstraResults == null) {
        eGraph.runDijkstra();
      } else {
        eGraph.dijkstraResults = null
      }

    }


    if (true) {
      let mousePos = createVector(mouseX, mouseY);
      let nodeUnderMouse = eGraph.nodes.find(node =>
        node.selected==true); // Assuming the node radius is 40

      if (nodeUnderMouse) {
        if (key === 'S' || key === 's') {
          eGraph.setStartNode(nodeUnderMouse);
          eGraph.deselectNode()
          
        } else if (key === 'E' || key === 'e') {
          eGraph.setEndNode(nodeUnderMouse);
          eGraph.deselectNode()
        }
        
      }
    }
    if ((keyCode === DELETE || keyCode === BACKSPACE)) {
      eGraph.removeNode(eGraph.selectedNode);
      eGraph.deselectNode()
      //eGraph.selectedNode = null; // Deselect the node after removal
    }
    if ((key === 'j' || key === 'J') && eGraph.selectedNode) { // If spacebar is pressed and there is a selected node
      const newName = prompt('xLabel For Node'); // Default to current value
      // Check if a valid name was entered
      eGraph.selectedNode.value = newName

      eGraph.selectedNode.selected = false; // Deselect the node visually
      eGraph.selectedNode = null; // Deselect the node logically
    }
  }
  if (mode == 2) {

    if (key == 'o') { // Spacebar key code

      document.getElementById('fileInput').click(); // Trigger file input click
      graphLoaded = true
    } else if (keyCode == 190) { // Start or proceed with the algorithm
      graph.executeStep();
    } else if (keyCode == 188) {
      graph.undoStep();
    } else if (key === 's' || key === 'S') {
      saveCanvasWithPrompt()
    } else if (key == 'd' || key == 'D') {
      appState.dataMode = !appState.dataMode
    }
  }
}

function forwardStep(){
  console.log('forward')
  graph.executeStep();
}
function backwardStep(){
  console.log('back')
  graph.undoStep();
}
function doubleClicked() {
  if (mode !== 1) return; // Ensure double-click functionality only in editor mode

  let mousePos = createVector(mouseX, mouseY);
  let nodeUnderMouse = eGraph.nodes.find(node =>
    dist(mousePos.x, mousePos.y, node.position.x, node.position.y) < 50);
  // eGraph.nodes.forEach(node => {
  //   node.connections.forEach((connection, index) => {
  //     const midPoint = createVector(
  //       (node.position.x + connection.node.position.x) / 2,
  //       (node.position.y + connection.node.position.y) / 2
  //     );

  //     // Check if the click is close to the midpoint of the connection
  //     if (mousePos.dist(midPoint) < 20) {
  //       // If Shift is held, delete the connection
  //       if (keyIsDown(SHIFT)) {
  //         node.removeConnection(connection.node);
  //         handledWeightLabelClick = true;
  //         // Ensure the graph is updated to reflect the deletion
  //         eGraph.display();
  //         return; // Exit the connections loop
  //       } else if (!window.weightUpdateInProgress) {
  //         // Handle weight update only if not currently updating another weight
  //         window.weightUpdateInProgress = true;
  //         const newWeight = prompt("Enter new weight:", connection.weight);
  //         if (newWeight !== null && !isNaN(newWeight) && newWeight.trim() !== '') {
  //           const weight = parseFloat(newWeight.trim());
  //           connection.weight = weight;
  //           // Also update the reciprocal connection weight
  //           const reciprocalConnection = connection.node.connections.find(conn => conn.node === node);
  //           if (reciprocalConnection) {
  //             reciprocalConnection.weight = weight;
  //           }
  //           // Recalculate paths if Dijkstra's results are displayed
  //           if (eGraph.dijkstraResults) {
  //             eGraph.runDijkstra();
  //           }
  //           eGraph.display(); // Refresh display to show updated weights
  //         }
  //         setTimeout(() => window.weightUpdateInProgress = false, 100); // Allow for weight updating again after prompt
  //         handledWeightLabelClick = true;
  //         return; // Exit the connections loop
  //       }
  //     }
  //   });

  //   if (handledWeightLabelClick) {
  //     return; // Exit the nodes loop if we handled a weight label click
  //   }

  //   // Node selection or dragging logic
  //   if (!handledWeightLabelClick && dist(mousePos.x, mousePos.y, node.position.x, node.position.y) < 50) {
  //     onNode = true; // Mark that we've clicked on a node

  //     if (keyIsDown(SHIFT)) {
  //       // Select the node for potential connection
  //       if (eGraph.selectedNode && eGraph.selectedNode !== node) {
  //         eGraph.selectedNode.connect(node);
  //         eGraph.deselectNode(); // Deselect node after connecting
  //       } else {
  //         eGraph.selectNode(node);
  //       }
  //     } else {
  //       // Prepare to drag the node
  //       eGraph.draggedNode = node;
  //     }
  //     return; // Exit the nodes loop since we've processed a node
  //   }
  // });

  // If a node is double-clicked
  if (nodeUnderMouse) {
    // If no node is currently selected, select the double-clicked node
    if (!eGraph.selectedNode) {
      eGraph.selectNode(nodeUnderMouse);
    } else if (eGraph.selectedNode && eGraph.selectedNode !== nodeUnderMouse) {
      // If another node is already selected, connect them
      eGraph.selectedNode.connect(nodeUnderMouse);
      eGraph.deselectNode(); // Optionally deselect nodes after connecting
    }
    return false; // Prevent default behavior
  }
}



function renameNode(){
  if(eGraph.selectedNode){
    const newName = prompt('New Label For Node'); // Default to current value
    // Check if a valid name was entered
    eGraph.selectedNode.value = newName

    eGraph.selectedNode.selected = false; // Deselect the node visually
    eGraph.selectedNode = null; // Deselect the node logically
  }

}

function editor() {

  background(190);
  eGraph.display();
  push()
  textSize(20)
  textAlign(LEFT)
  strokeWeight(1)
  if (instructionShow == false && appState.modeTextShow) {
    let t = textWidth('EDITOR MODE Weight Lock OFF')*1.5
    if (appState.weightLock) {
      text('EDITOR MODE Weight Lock ON', width-t, 20)
    } else {
      text('EDITOR MODE Weight Lock OFF', width-t, 20)
    }
  }

  pop()
  textAlign(CENTER, CENTER);
  if (keyIsDown(LEFT_ARROW)) {
    eGraph.moveGraphX(-3)
  }
  if (keyIsDown(RIGHT_ARROW)) {
    eGraph.moveGraphX(3)
  }
  if (keyIsDown(UP_ARROW)) {
    eGraph.moveGraphY(-3)
  }
  if (keyIsDown(DOWN_ARROW)) {
    eGraph.moveGraphY(3)
  }

  // Draw alignment lines
  push()
  strokeWeight(2)
  if (appState.lineMode) {
    if (drawVLine) {
      stroke(255, 0, 0); // Red line for visibility
      line(linePosX, 0, linePosX, height); // Vertical line
    }
    if (drawHLine) {
      stroke(255, 0, 0); // Red line for visibility
      line(0, linePosY, width, linePosY); // Horizontal line
    }
  }

  pop()

}

// Check if a point is close enough to any node to be considered a collision
function isCloseToNode(point, threshold = 80) {
  return eGraph.nodes.some(node => {
    return dist(point.x, point.y, node.position.x, node.position.y) < threshold;
  });
}
function updateCurrentNodeName(eGraph) {
  let highestCharCode = 64; // ASCII code for 'A' - 1, so 'A' will be the default if no nodes exist.

  eGraph.nodes.forEach(node => {
    const charCode = node.value.charCodeAt(0);
    if (charCode > highestCharCode) {
      highestCharCode = charCode;
    }
  });

  // Now set the currentNodeName to the next character, if it's less than 'Z'
  if (highestCharCode < 90) { // ASCII code for 'Z'
    currentNodeName = String.fromCharCode(highestCharCode + 1);
  } else {
    console.warn("Reached the maximum node name. Resetting or handling needed.");
    // Handle cases where you've reached 'Z'. Resetting, or extending the naming scheme.
  }
}



function saveCanvasWithPrompt() {
  // Prompt the user for a filename
  let filename = prompt("Enter a filename for your image:", "myGraph");

  // Check if the user entered a filename or pressed Cancel
  if (filename) {
    // If a filename was provided, save the canvas as a PNG with that filename
    saveCanvas(filename, 'png');
  } else {
    // If no filename was provided (Cancel was pressed), do not save the canvas
    console.log("Save cancelled by user.");
  }
}




// Update the weights of connections for a given node
function updateConnectionWeights(node) {
  node.connections.forEach(connection => {
    // Recalculate the weight based on the new position
    const newWeight = floor(node.position.dist(connection.node.position) / 10);
    // Update the weight in the current direction
    connection.weight = newWeight;
    // Update the weight in the opposite direction
    const reciprocalConnection = connection.node.connections.find(conn => conn.node === node);
    if (reciprocalConnection) {
      reciprocalConnection.weight = newWeight;
    }
  });
}


function serializeGraph(graph) {
  const nodes = graph.nodes.map(node => {
    return {
      value: node.value,
      position: { x: node.position.x, y: node.position.y },
      connections: node.connections.map(connection => ({
        nodeValue: connection.node.value,
        weight: connection.weight
      })),
      heuristic: node.heuristic // Save the heuristic value
    };
  });

  // Include start and end node values
  const startNodeValue = graph.startNode ? graph.startNode.value : null;
  const endNodeValue = graph.endNode ? graph.endNode.value : null;

  return JSON.stringify({ nodes, startNodeValue, endNodeValue });
}



function deserializeGraph(graphData) {
  const data = JSON.parse(graphData);

  // Determine the correct graph type to instantiate based on mode or data
  let newGraph;
  if (mode == 1) {
    newGraph = new EditGraph();
  } else if (mode == 2) {
    newGraph = new ViewerGraph();
  } else {
    console.error("Invalid mode for graph deserialization.");
    return null; // Exit if the mode is not correctly defined
  }

  // First, create all nodes in the new graph
  data.nodes.forEach(nodeData => {
    const newNode = newGraph.addNode(nodeData.value, createVector(nodeData.position.x, nodeData.position.y));
    // If there are additional properties (like heuristic) that need to be set directly, do so here
    if (typeof nodeData.heuristic !== 'undefined') {
      newNode.heuristic = nodeData.heuristic;
    }
  });

  // Then, recreate connections between nodes
  data.nodes.forEach(nodeData => {
    const fromNode = newGraph.findNode(nodeData.value);
    nodeData.connections.forEach(connectionData => {
      const toNode = newGraph.findNode(connectionData.nodeValue);
      fromNode.connect(toNode, connectionData.weight);
    });
  });

  // If start and end nodes are saved, restore them
  if (data.startNodeValue !== null) {
    const startNode = newGraph.findNode(data.startNodeValue);
    if (startNode) newGraph.setStartNode(startNode);
  }
  if (data.endNodeValue !== null) {
    const endNode = newGraph.findNode(data.endNodeValue);
    if (endNode) newGraph.setEndNode(endNode);
  }

  // Return the fully reconstructed graph
  return newGraph;
}



function mouseReleased() {
  drawVLine = drawHLine = false;
  eGraph.draggedNode = null; // Clear the dragged node selection
}



function loadGraph(event) {
  if (mode == 1) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // Clear the current graph before loading a new one
        eGraph.clearGraph();

        // Parse the loaded JSON string
        const graphData = JSON.parse(e.target.result);

        // Deserialize the new eGraph data
        eGraph = deserializeGraph(graphData);

        // Update currentNodeName based on the loaded graph
        updateCurrentNodeName(eGraph);

        // Optional: Re-initialize or update any UI elements or visualizations as needed
      };
      reader.readAsText(file);
    }
  }
  if (mode == 2) {
    //console.log('viewer load codr')
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        // Clear the current graph before loading a new one
        graph.clearGraph();

        // Parse the loaded JSON string
        const graphData = JSON.parse(e.target.result);

        // Deserialize the new graph data
        graph = deserializeGraph(graphData);

        // Reset the file input to ensure the change event fires even if the same file is selected again
        event.target.value = '';

        // Additional state resets as needed
        graphLoaded = true;
        resetGraphState(); // Reset other graph-related states as necessary
      };
      reader.readAsText(file);
    }
  }

}



function viewer() {

  background(190);
  graph.display();
  if (appState.modeTextShow) {
    push()
    textSize(20)
    textAlign(LEFT)
    strokeWeight(1)
    let t = textWidth('VIEWER MODE Weight Lock OFF')*1.5
    text('VIEWER MODE', width-t, 20)
    pop()
  }

  if (keyIsDown(SHIFT)) {
    if (keyIsDown(LEFT_ARROW)) {
      graph.dataTableOffsetX += 3;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      graph.dataTableOffsetX -= 3;
    }
    if (keyIsDown(UP_ARROW)) {
      graph.dataTableOffsetY -= 3;
    }
    if (keyIsDown(DOWN_ARROW)) {
      graph.dataTableOffsetY += 3;
    }
  } else {
    if (keyIsDown(LEFT_ARROW)) {
      graph.moveGraphX(-3)
    }
    if (keyIsDown(RIGHT_ARROW)) {
      graph.moveGraphX(3)
    }
    if (keyIsDown(UP_ARROW)) {
      graph.moveGraphY(-3)
    }
    if (keyIsDown(DOWN_ARROW)) {
      graph.moveGraphY(3)
    }
  }
  if (keyIsDown(189)) {
     scaleFactor -= 0.005
    
    
  }
  if (keyIsDown(187)) {
     scaleFactor += 0.005
  }
  scaleFactor = constrain(scaleFactor, 0.35, 1.4)

  if (graph.algorithmState == 1) {
    graph.displayData()
  }

}


function increaseZoom(){
  scaleFactor -= 0.05
}
function decreaseZoom(){
  scaleFactor += 0.05
}


function toggleSettingsPanel() {
  showSettings = !showSettings;
  const settingsPanel = select('#settingsPanel');
  if (showSettings) {
    settingsPanel.show();
    // Ensure all toggle-container elements are visible
    selectAll('.toggle-container').forEach(container => {
      container.style('display', 'flex');
    });
  } else {
    settingsPanel.hide();
  }
}

function resetGraphState() {
  // Reset any graph-related state here, such as algorithmState, dijkstraResults, etc.
  graph.algorithmState = null;
  graph.dijkstraResults = null;
  // Reset or reinitialize any other state variables that need to be cleared when a new graph is loaded
}

class ActionButton {
  constructor(labelText, actionFunction) {
    this.labelText = labelText;
    this.actionFunction = actionFunction;

    this.createElements();
  }

  createElements() {
    this.container = createDiv('').addClass('action-container');
    this.container.style('display', 'flex');
    this.container.style('justify-content', 'space-between');
    this.container.style('align-items', 'center');
    this.container.style('margin-bottom', '10px');
    this.container.style('width', '100%'); // Match the toggle switch container

    this.label = createSpan(this.labelText).parent(this.container);
    this.label.style('margin-right', '10px');

    // Create a button that looks like the toggle switch but doesn't toggle
    this.button = createButton('').parent(this.container);
    this.button.addClass('action-button'); // Use a class to style the button
    this.button.style('background-color', '#ccc'); // Default background
    this.button.style('border', '1px solid black'); // Match toggle switch border
    this.button.style('border-radius', '13.5px'); // Rounded edges
    this.button.style('width', '54px'); // Width to match the toggle switch
    this.button.style('height', '27px'); // Height to match the toggle switch

    this.button.mousePressed(() => {
      this.actionFunction(); // Call the provided action function
      this.button.style('background-color', '#4CD964'); // Change color to green when clicked
      setTimeout(() => {
        this.button.style('background-color', '#ccc'); // Revert to default color after a short delay
      }, 200);
    });

    this.container.parent('#settingsPanel'); // Append to the settings panel
  }
}

class ToggleSwitch {
  constructor(labelText, stateKey, appState) {
    this.labelText = labelText;
    this.stateKey = stateKey; // The key for the variable in appState
    this.appState = appState; // The global state object

    toggleSwitches.push(this); // Add this instance to the array

    this.createElements();
    this.updateSwitchState();
  }
  createElements() {
    console.log("Creating elements for:", this.labelText); // Debugging line

    // Existing element creation code...

    // After adding elements to the DOM


    this.container = createDiv('').addClass('toggle-container');
    this.container.style('display', 'flex');
    this.container.style('justify-content', 'space-between');
    this.container.style('align-items', 'center');
    this.container.style('margin-bottom', '10px');
    this.container.style('width', '100%'); // Ensure it fills its parent

    this.label = createSpan(this.labelText).parent(this.container);
    this.label.style('margin-right', '10px');

    this.toggle = createDiv('').addClass('toggle-switch').parent(this.container);
    this.knob = createDiv('').addClass('toggle-knob').parent(this.toggle);
    //***********************
    this.toggle.mousePressed((e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleState();
    });
    this.toggle.elt.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.toggleState();
    }, false);
    //************************
    this.toggle.mouseClicked(() => this.toggleState());

    // Ensure the settings panel is initially hidden
    this.container.parent('#settingsPanel');

    console.log("Container for", this.labelText, "added to the settings panel");
  }
  toggleState() {
    this.appState[this.stateKey] = !this.appState[this.stateKey];
    this.updateSwitchState();

    console.log(`State of ${this.stateKey}:`, this.appState[this.stateKey]); // Debugging
  }

  updateSwitchState() {
    this.state = this.appState[this.stateKey]; // Update local state based on appState
    if (this.state) {
      this.toggle.addClass('active');
    } else {
      this.toggle.removeClass('active');
    }
  }


}




class ChangeButton {
  constructor(labelText, upFunction, downFunction, downLabel, upLabel) {
    this.labelText = labelText;
    this.upFunction = upFunction;
    this.downFunction = downFunction;
    this.downLabel = downLabel;
    this.upLabel = upLabel;

    this.createElements();
  }
 
  createElements() {
      // Main container for the label and buttons
      this.container = createDiv('').addClass('change-button-container');
      this.container.style('display', 'flex');
      this.container.style('align-items', 'center');
      this.container.style('justify-content', 'space-between'); // Ensures spacing between label and buttons
      this.container.style('margin-bottom', '10px');
      this.container.style('position', 'relative');
      this.container.style('width', '100%'); // Utilizes full width to position elements
      this.container.parent('#settingsPanel');

      // Label positioned to the left of the buttons
      this.label = createSpan(this.labelText).parent(this.container);
      this.label.style('margin-right', '10px');

      // Pill-shaped container specifically for the buttons
      this.buttonContainer = createDiv('').addClass('pill-container');
      this.buttonContainer.style('display', 'flex');
      this.buttonContainer.style('justify-content', 'space-between');
      this.buttonContainer.style('align-items', 'center');
      this.buttonContainer.style('position', 'absolute');
      this.buttonContainer.style('right', '0px'); // Positions the container 5px from the right
      this.buttonContainer.style('width', '53px'); // Adjusted width to match other controls
      this.buttonContainer.style('height', '27px'); // Adjusted height
      this.buttonContainer.style('border-radius', '15px'); // Pill shape
      this.buttonContainer.style('border', '1px solid black'); // Thin black border
      this.buttonContainer.style('background-color', '#ccc');
      this.buttonContainer.parent(this.container);

      // Creating the up and down buttons within the pill container
      this.createSubButton(this.upButton, this.upLabel, this.upFunction, 'flex-end');
      this.createSubButton(this.downButton, this.downLabel, this.downFunction, 'flex-start');
  }

  createSubButton(button, label, actionFunction, justifyContent) {
      button = createButton(label).parent(this.buttonContainer);
      button.style('width', '23px');
      button.style('height', '23px');
      button.style('border-radius', '50%'); // Circular shape
      button.style('border', '1px solid black');
      button.style('background-color', '#ccc');
      button.style('color', 'black');
      button.style('justify-content', justifyContent);
      button.style('cursor', 'pointer');
      button.style('margin', '2px 2px'); // Adjust margin to bring sub-buttons closer

      button.mousePressed(actionFunction);

      // Flash effect on click
      button.mouseClicked(() => {
          button.style('background-color', '#4CD964'); // Change to green temporarily
          setTimeout(() => button.style('background-color', '#ccc'), 200); // Revert to original color
      });
  }


}


class TextField {
  constructor(text) {
    this.text = text;
    this.createElements();
  }

  createElements() {
    // Main container for the text field
    this.container = createDiv(this.text).addClass('text-field-container');
    this.container.style('width', '270px'); // Fixed width of 100px
    this.container.style('padding', '10px'); // Uniform padding
    this.container.style('margin', '10px auto'); // Center container
    this.container.style('border', '1px solid black'); // Thin black border
    this.container.style('text-align', 'center'); // Center the text within
    this.container.style('font-size', '23px'); // Slightly larger text size
    this.container.style('color', '#000'); // Text color
    this.container.style('background-color', '#f0f0f0'); // Pale grey background color
    this.container.style('box-sizing', 'border-box'); // Include padding and border in the element's total width and height
    this.container.parent('#settingsPanel'); // Assuming it's to be added to an element with id 'settingsPanel'
  }
}


class MovementControl {
  constructor(x, y,type) {
    this.type = type
    this.x = x;
    this.y = y;

    this.visible = true;
    this.buttonSize = 35; // Size of the clickable circles
    this.activeButton = null; // Track the active button
  }

  display() {

    if (!this.visible) return; // Don't display if not visible
    push()
    textAlign(CENTER,CENTER)
    textSize(15)
    if(this.type==0){
      text('GRAPH',this.x+50,this.y-10)
    }else{
      text('TABLE',this.x+50,this.y-10)
    }
    stroke(0);
    fill(220);
    rect(this.x, this.y, 100, 100, 10);

    // Check which button, if any, is currently active
    this.updateActiveButton(mouseX, mouseY);

    // Directional controls
    noStroke();

    // Up
    fill(this.activeButton === "UP" ? 'green' : 150);
    circle(this.x + 50, this.y + 20, this.buttonSize);

    // Down
    fill(this.activeButton === "DOWN" ? 'green' : 150);
    circle(this.x + 50, this.y + 80, this.buttonSize);

    // Left
    fill(this.activeButton === "LEFT" ? 'green' : 150);
    circle(this.x + 20, this.y + 50, this.buttonSize);

    // Right
    fill(this.activeButton === "RIGHT" ? 'green' : 150);
    circle(this.x + 80, this.y + 50, this.buttonSize);
    pop()
    this.checkClick(mouseX,mouseY)
  }

  updateActiveButton(mx, my) {
    if (!this.visible || !mouseIsPressed) {
      this.activeButton = null;
      return;
    }

    // Determine which button is active based on mouse position
    if (dist(mx, my, this.x + 50, this.y + 20) < this.buttonSize / 2) {
      this.activeButton = "UP";
    } else if (dist(mx, my, this.x + 50, this.y + 80) < this.buttonSize / 2) {
      this.activeButton = "DOWN";
    } else if (dist(mx, my, this.x + 20, this.y + 50) < this.buttonSize / 2) {
      this.activeButton = "LEFT";
    } else if (dist(mx, my, this.x + 80, this.y + 50) < this.buttonSize / 2) {
      this.activeButton = "RIGHT";
    } else {
      this.activeButton = null; // No button is currently active
    }
  }

  checkClick() {
    if (this.activeButton && mouseIsPressed) {
      this.move(this.activeButton);
    }
  }

  move(direction) {
    const moveStep = 3; // Movement step size
    console.log(direction); // Log the direction for debugging
    // Uncomment and adjust graph and dataTable positions based on the direction

    switch (direction) {
      case "UP":
        console.log('up')
        if(this.type == 0){
          if(mode==1){
            eGraph.moveGraphY(-3);
          }else{
            graph.moveGraphY(-3);
          }
       
        }else{
          
          graph.dataTableOffsetY -= 3;
        }
        break;
      case "DOWN":
         console.log('down')
        if(this.type == 0){
          if(mode==1){
            eGraph.moveGraphY(3);
          }else{
            graph.moveGraphY(3);
          }
          
          
        }else{
          graph.dataTableOffsetY += 3;
        }

        break;
      case "LEFT":
         console.log('left')
        if(this.type == 0){
          if(mode==1){
            eGraph.moveGraphX(-3);
          }else{
            graph.moveGraphX(-3);
          }
          
        }else{
          graph.dataTableOffsetX += 3;
        }

        break;
      case "RIGHT":
         console.log('right')
        if(this.type == 0){
          if(mode==1){
            eGraph.moveGraphX(3);
          }else{
            graph.moveGraphX(3);
          }
          graph.moveGraphX(3);
        }else{
           graph.dataTableOffsetX -= 3;
        }

        break;
    }


  }

  toggleVisibility() {
    this.visible = !this.visible;
  }
}



class EditNode {
  constructor(value, position) {
    this.value = value;
    this.position = position;
    this.connections = [];
    this.selected = false;
    this.isStartNode = false; // Add this line
    this.isEndNode = false; // Add this line

  }




  // Connect this node to another node and calculate the weight based on distance
  connect(node, weight = null) {
    const connectionExists = this.connections.some(conn => conn.node === node);
    if (!connectionExists) {
      // Calculate weight based on distance if not provided
      if (weight === null) {
        weight = this.calculateWeight(node);
      }
      this.connections.push({ node: node, weight: weight });
      node.connections.push({ node: this, weight: weight }); // Also update the reciprocal connection
    }
  }

  removeConnection(targetNode) {
    // Remove the targetNode from this node's connections
    this.connections = this.connections.filter(connection => connection.node !== targetNode);
    // Also remove this node from targetNode's connections
    targetNode.connections = targetNode.connections.filter(connection => connection.node !== this);
  }

  // Method to calculate weight based on the distance between nodes
  calculateWeight(targetNode) {
    return floor(dist(this.position.x, this.position.y, targetNode.position.x, targetNode.position.y) / 10); // Example calculation
  }
  getAdjacentNodes() {
    return this.connections.map(connection => connection.node);
  }

  isConnected(node) {
    return this.connections.some(connection => connection.node === node);
  }

  // Optional: Method to get the connection weight between this node and another node
  getWeight(node) {
    const connection = this.connections.find(connection => connection.node === node);
    return connection ? connection.weight : null;
  }
}

class EditGraph {
  constructor() {
    this.nodes = [];
    this.draggedNode = null;
    this.selectedNode = null;
    this.startNode = null;
    this.endNode = null;
    this.dijkstraResults = null; // Store Dijkstra's algorithm results
    this.grid = false
    this.processing = false; // Indicates if the node is currently being processed
    this.visited = false; // Indicates if the node has
    this.dist = Infinity;
    this.prev = null;
    this.heuristic = 0;
  }


  randomizeWeights(minWeight, maxWeight) {
    // Ensure minWeight and maxWeight are integers and minWeight < maxWeight
    minWeight = Math.ceil(Math.min(minWeight, maxWeight));
    maxWeight = Math.floor(Math.max(minWeight, maxWeight));
    appState.weightLock = true
    updateToggleSwitches()
    // Track processed pairs to avoid double-processing
    const processedPairs = new Set();

    this.nodes.forEach(node => {
      node.connections.forEach(connection => {
        const pairKey = `${node.value}-${connection.node.value}`;
        const reversePairKey = `${connection.node.value}-${node.value}`;

        // Skip if this pair has already been processed
        if (processedPairs.has(pairKey) || processedPairs.has(reversePairKey)) {
          return;
        }

        // Generate a random weight between minWeight and maxWeight, inclusive
        const randomWeight = Math.floor(Math.random() * (maxWeight - minWeight + 1)) + minWeight;

        // Set the new weight for both directions of the connection
        connection.weight = randomWeight;
        const reciprocalConnection = connection.node.connections.find(conn => conn.node === node);
        if (reciprocalConnection) {
          reciprocalConnection.weight = randomWeight;
        }

        // Mark this pair as processed
        processedPairs.add(pairKey);
        processedPairs.add(reversePairKey);
      });
    });
  }

  addNodes(number) {
    currentNodeName = 'A'
    eGraph.nodes = []
    for (let i = 0; i < number; i++) {
      this.nodes.push(new EditNode(nodeNames[currentNodeNameRow][currentNodeIndex], createVector(100, 100)))
      currentNodeName = String.fromCharCode(currentNodeName.charCodeAt(0) + 1)

      currentNodeIndex += 1
      if (currentNodeIndex > 25) {
        currentNodeIndex = 0
        currentNodeNameRow = (currentNodeNameRow + 1) % 2
      }
    }
  }

  makeGrid(numberOfNodes, spacing, startX, startY, weight = 10) {
    this.addNodes(numberOfNodes)
    this.clearConnections()
    this.gridNodes(spacing, startX, startY)
    this.connectGridNodes(weight)
  }
  connectGridNodes(weight = 10) {
    const nodesPerRow = Math.ceil(Math.sqrt(this.nodes.length)); // Assuming a square grid for simplicity
    const numRows = Math.ceil(this.nodes.length / nodesPerRow);

    this.nodes.forEach((node, index) => {
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;

      // Connect to the right neighbor
      if (col < nodesPerRow - 1) { // Check if not on the right edge
        const rightNeighborIndex = index + 1;
        if (this.nodes[rightNeighborIndex]) { // Check if the right neighbor exists
          node.connect(this.nodes[rightNeighborIndex], weight);
        }
      }

      // Connect to the bottom neighbor
      if (row < numRows - 1) { // Check if not on the bottom edge
        const bottomNeighborIndex = index + nodesPerRow;
        if (this.nodes[bottomNeighborIndex]) { // Check if the bottom neighbor exists
          node.connect(this.nodes[bottomNeighborIndex], weight);
        }
      }
    });
    weightLock = true
    updateToggleSwitches()
  }

  // Method to clear all connections between nodes
  clearConnections() {
    this.nodes.forEach(node => {
      node.connections = []; // Clear connections for each node
    });
  }
  // Method to arrange nodes in a grid pattern
  gridNodes(spacing, startX, startY) {
    const nodesPerRow = Math.ceil(Math.sqrt(this.nodes.length)); // Calculate nodes per row to form a square grid if possible

    this.nodes.forEach((node, index) => {
      const row = Math.floor(index / nodesPerRow);
      const col = index % nodesPerRow;

      node.position.x = startX + col * spacing;
      node.position.y = startY + row * spacing;
    });
  }


  drawGrid() {
    push()
    // stroke(	152, 251, 152,180)
    stroke(5, 21, 212, 180)
    strokeWeight(1)
    for (let y = 50; y < height; y += 52) {
      line(0, y, width, y)
    }
    for (let x = 0; x <= width; x += 52) {
      line(x, 50, x, height)
    }
    pop()
  }

  moveGraphY(dy) {
    this.nodes.forEach(node => {
      node.position.y += dy;
    });
  }

  moveGraphX(dx) {
    this.nodes.forEach(node => {
      node.position.x += dx;
    });
  }


  runDijkstra() {
    if (this.startNode) {
      this.dijkstraResults = this.dijkstra(this.startNode.value);
    } else {
      console.log("Start node is not selected.");
    }
  }
  clearGraph() {
    this.nodes = [];
    this.draggedNode = null;
    this.selectedNode = null;
    this.startNode = null;
    this.endNode = null;
    this.dijkstraResults = null;
  }

  setStartNode(node) {
    if (this.startNode === node) {
      this.startNode.isStartNode = false; // Deselect the node
      this.startNode = null; // Clear the reference
    } else {
      if (this.startNode) {
        this.startNode.isStartNode = false; // Reset previous start node
      }
      this.startNode = node;
      node.isStartNode = true; // Mark new start node
    }
  }

  setEndNode(node) {
    if (this.endNode === node) {
      this.endNode.isEndNode = false; // Deselect the node
      this.endNode = null; // Clear the reference
    } else {
      if (this.endNode) {
        this.endNode.isEndNode = false; // Reset previous end node
      }
      this.endNode = node;
      node.isEndNode = true; // Mark new end node
    }
  }

  dijkstra(startValue) {
    let distances = {}; // Store distances from start node
    let prev = {}; // Store previous node in optimal path
    let visited = new Set(); // Keep track of visited nodes

    // Initialize distances and prev
    this.nodes.forEach(node => {
      distances[node.value] = Infinity;
      prev[node.value] = null;
    });

    distances[startValue] = 0; // Distance from start node to itself is 0

    // Function to find the node with the smallest distance that hasn't been visited
    const findMinDistanceNode = (distances, visited) => {
      let minDistance = Infinity;
      let minNode = null;

      for (let node of this.nodes) {
        if (!visited.has(node.value) && distances[node.value] < minDistance) {
          minDistance = distances[node.value];
          minNode = node;
        }
      }
      return minNode;
    };

    let currentNode = this.findNode(startValue);

    while (currentNode) {
      let currentDistance = distances[currentNode.value];
      visited.add(currentNode.value);

      currentNode.connections.forEach(connection => {
        let distance = currentDistance + connection.weight;
        if (distance < distances[connection.node.value]) {
          distances[connection.node.value] = distance;
          prev[connection.node.value] = currentNode.value;
        }
      });

      currentNode = findMinDistanceNode(distances, visited);
    }

    return { distances, prev };
  }

  selectNode(node) {
    // Deselect any currently selected node
    if (this.selectedNode) {
      this.selectedNode.selected = false;
    }
    // Select the new EditNode
    this.selectedNode = node;
    node.selected = true; // You'll use this property to change the node's color
  }

  deselectNode() {
    if (this.selectedNode) {
      this.selectedNode.selected = false;
      this.selectedNode = null;
    }
  }

  // Method to add a node to the graph
  addNode(value, position) {
    //console.log(value,position)
    const newNode = new EditNode(value, position);
    this.nodes.push(newNode);
    return newNode; // Return the new EditNode for reference
  }

  // Find a node by its value
  findNode(value) {
    return this.nodes.find(node => node.value === value);
  }

  // Connect two nodes by their values
  connectNodes(value1, value2) {
    const node1 = this.findNode(value1);
    const node2 = this.findNode(value2);
    if (node1 && node2) {
      node1.connect(node2);
    } else {
      console.error("One or both nodes not found");
    }
  }

  // Method to get the shortest path from start to end node
  getShortestPath() {
    let path = [];
    if (!this.endNode || !this.dijkstraResults) {
      return path; // Return empty if no end node or Dijkstra's results
    }

    let currentNode = this.endNode.value;
    while (currentNode && this.dijkstraResults.prev[currentNode] !== null) {
      path.unshift(currentNode); // Add to the beginning of the path
      currentNode = this.dijkstraResults.prev[currentNode];
    }

    if (this.startNode && path[0] !== this.startNode.value) {
      path.unshift(this.startNode.value); // Ensure the start node is at the beginning
    }

    return path;
  }


  removeNode(nodeToRemove) {
    // Remove connections to this node from other nodes
    this.nodes.forEach(node => {
      node.connections = node.connections.filter(connection => connection.node !== nodeToRemove);
    });

    // Remove the node itself from the graph
    this.nodes = this.nodes.filter(node => node !== nodeToRemove);
  }




  display() {
    if (appState.grid) {
      this.drawGrid()
    }

    push()
    strokeWeight(1);
    let shortestPath = this.getShortestPath();
    this.nodes.forEach(node => {
      node.connections.forEach(connection => {
        // Determine if this connection is part of the shortest path
        let isPathConnection = shortestPath.includes(node.value) && shortestPath.includes(connection.node.value);
        let currentIndex = shortestPath.indexOf(node.value);
        let nextIndex = shortestPath.indexOf(connection.node.value);

        // Highlight the path if the nodes are consecutive in the shortest path
        if (isPathConnection && Math.abs(currentIndex - nextIndex) === 1) {
          stroke('#FFD700'); // Highlight color for the path
          strokeWeight(4); // Make the path bolder
        } else {
          stroke(0); // Default color
          strokeWeight(1); // Default stroke weight
        }

        // Draw line for connection
        line(node.position.x, node.position.y, connection.node.position.x, connection.node.position.y);

        // Draw weight ellipse
        push()
        textAlign(CENTER, CENTER);
        fill(190);
        noStroke()
        ellipse((node.position.x + connection.node.position.x) / 2, (node.position.y + connection.node.position.y) / 2, 30);
        pop()
        textSize(17);
        fill(0);
        stroke(0);
        strokeWeight(1)
        text(connection.weight, (node.position.x + connection.node.position.x) / 2, (node.position.y + connection.node.position.y) / 2);

        // Reset stroke settings for next connection

        strokeWeight(3);
      });

    });
    pop()

    // Draw nodes on top of connections for clear visibility
    this.nodes.forEach(node => {
      // Node color based on its role
      fill('#ADD8E6');
      if (node.selected) {
        fill('yellow')
      }
      if (node.isStartNode) {
        fill('#00FF00'); // Green for the start node
      } else if (node.isEndNode) {
        fill('#FF0000'); // Red for the end node
      } else if (shortestPath.includes(node.value)) {
        fill('#FFD700'); // Highlight color for nodes in the path
      }
      push()
      // Draw node
      strokeWeight(4);
      if(node.isStartNode){
        strokeWeight(6)
        stroke('#00FF00')
          fill('#ADD8E6');
      }
      if(node.isEndNode){
        strokeWeight(6)
        stroke('red')
          fill('#ADD8E6');
      }
      if (node.selected) {
        fill('yellow')
      }
      strokeWeight(5)
      ellipse(node.position.x, node.position.y, 100);
      pop()
      // Draw node value
      fill(0); // Text color
      textSize(40);


      // Display Dijkstra's path information if available
      if (this.dijkstraResults) {
        push()
        strokeWeight(1)
        stroke(0)
        text(node.value, node.position.x, node.position.y - 20);
        pop()
        let dist = this.dijkstraResults.distances[node.value];
        //dist === Infinity ? c : dist;
        if (dist == Infinity) {
          dist = "∞"
        }
        let prev = this.dijkstraResults.prev[node.value];
        let infoText1
        if (dist != undefined) {
          infoText1 = `${dist}`
        } else {
          infoText1 = ''
        }

        let infoText2 = `${prev ? prev : ''}`


        if (infoText1 == undefined) infoText1 = ''

        push();
        strokeWeight(1)
        fill(0); // Text color
        textSize(19);
        if (dist == "∞") {
          textSize(30)
        } else {
          textSize(19)
        }
        text(infoText2, node.position.x, node.position.y + 30);

        text(infoText1, node.position.x, node.position.y + 10);
        pop();
      } else {
        push()
        strokeWeight(1)
        textSize(60)
        text(node.value, node.position.x, node.position.y);
        pop()
      }
    });
  }

}






class ViewerNode {
  constructor(value, position) {
    this.value = value;
    this.position = position;
    this.connections = [];
    this.selected = false;
    this.isStartNode = false; // Add this line;
    this.isEndNode = false; // Add this line
    this.processing = false; // Indicates if the node is currently being processed
    this.visited = false; // Indicates if the node has
    this.dist = Infinity;
    this.prev = null;

    this.heuristic = 0;
  }


  connect(node, weight = null) {
    const connectionExists = this.connections.some(conn => conn.node === node);
    if (!connectionExists) {
      // Calculate weight based on distance if not provided
      if (weight === null) {
        weight = this.calculateWeight(node);
      }
      this.connections.push({ node: node, weight: weight });
      node.connections.push({ node: this, weight: weight }); // Also update the reciprocal connection
    }
  }



  getAdjacentNodes() {
    return this.connections.map(connection => connection.node);
  }

  isConnected(node) {
    return this.connections.some(connection => connection.node === node);
  }

  // Optional: Method to get the connection weight between this node and another node
  getWeight(node) {
    const connection = this.connections.find(connection => connection.node === node);
    return connection ? connection.weight : null;
  }
}

class ViewerGraph {
  constructor() {
    this.nodes = [];
    this.history = [];
    this.startNode = null;
    this.endNode = null
    this.dijkstraResults = null;
    this.algorithmState = null; // Object to hold state information
    this.dijkstraQueue = []; // This will act as a priority queue for the algorithm
    this.dijkstraVisited = new Set(); // Keeps track of visited nodes
    this.dijkstraDistances = {}; // Keeps track of distances
    this.dijkstraPrevious = {}; // Keeps track of previous nodes in the path
    this.dataTableOffsetX = 450; // Initial offset for the data table
    this.dataTableOffsetY = 50; // Initial Y position for the data tabl
    this.neighbourInfoShow = false;
  }

  toggleNeighbourInfoShow() {
    appState.neighbourInfoShow = !appState.neighbourInfoShow;
    updateToggleSwitches()
    this.display(); // Assuming this method will eventually call `displayData`
  }

  saveState() {
    const nodesState = this.nodes.map(node => ({
      value: node.value,
      dist: node.dist,
      prev: node.prev ? node.prev.value : null, // Save prev node's value
      visited: node.visited,
      processing: node.processing,
    }));

    const state = {
      nodesState: nodesState,
      dijkstraQueue: [...this.dijkstraQueue], // Capture the current queue state
      dijkstraVisited: [...this.dijkstraVisited], // Capture the current visited set
      // Include dijkstraDistances and dijkstraPrevious if necessary
    };

    this.history.push(state);
  }
  moveGraphY(dy) {
    this.nodes.forEach(node => {
      node.position.y += dy;
    });
  }

  moveGraphX(dx) {
    this.nodes.forEach(node => {
      node.position.x += dx;
    });
  }
  undoStep() {
    if (this.history.length > 0) {
      const prevState = this.history.pop();

      // Clear the current state
      this.dijkstraQueue = [];
      this.dijkstraVisited.clear();

      // Restore the global state
      prevState.dijkstraQueue.forEach(item => {
        this.dijkstraQueue.push({ ...item });
      });
      prevState.dijkstraVisited.forEach(visitedNodeValue => {
        this.dijkstraVisited.add(visitedNodeValue);
      });

      // Restore each node's state
      this.nodes.forEach(node => {
        const savedNodeState = prevState.nodesState.find(n => n.value === node.value);
        if (savedNodeState) {
          node.dist = savedNodeState.dist;
          node.prev = savedNodeState.prev ? this.findNode(savedNodeState.prev) : null; // Ensuring prev is a node object
          node.visited = savedNodeState.visited;
          node.processing = savedNodeState.processing;
        }
      });

      // Correctly setting dijkstraDistances and dijkstraPrevious based on restored node states
      this.dijkstraDistances = {};
      this.dijkstraPrevious = {};
      this.nodes.forEach(node => {
        this.dijkstraDistances[node.value] = node.dist;
        if (node.prev) {
          this.dijkstraPrevious[node.value] = node.prev.value;
        }
      });
    }
  }




  initializeDijkstra(startNodeValue) {
    // Reset the algorithm's state
    removeAllButtons()
    
    this.algorithmState = 1
    this.dijkstraQueue = []; // Start with an empty queue
    this.dijkstraVisited.clear();
    this.nodes.forEach(node => {
      // Reset distances and previous nodes for all nodes
      this.dijkstraDistances[node.value] = Infinity;
      this.dijkstraPrevious[node.value] = null;
      // Reset node-specific states
      node.dist = Infinity;
      node.prev = null;
      node.processing = false;
      node.visited = false;
    });

    // Ensure the start node's distance is set to 0 correctly
    const startNode = this.findNode(startNodeValue);
    if (startNode) {
      startNode.dist = 0; // Set start node's own distance to 0
      startNode.processing = true; // Optionally mark it as processing if needed for visual cues
      // Update global trackers
      this.dijkstraDistances[startNodeValue] = 0;
      // Add start node to the queue with a priority of 0
      this.dijkstraQueue.push({ node: startNodeValue, priority: 0 });
    } else {
      console.error("Start node not found:", startNodeValue);
      return; // Exit if start node is not found to avoid further errors
    }
    addViewerButtonsToPanel()
    console.log('Initialization complete with start node:', startNodeValue);
  }



  executeStep() {
    this.saveState();
    if (this.dijkstraQueue.length === 0) {
      console.log("Dijkstra's algorithm has finished executing.");
      // Update dijkstraResults to reflect the final state
      this.dijkstraResults = {
        distances: { ...this.dijkstraDistances },
        prev: { ...this.dijkstraPrevious }
      };
      return;
    }

    // Ensure the queue is sorted by priority (distance)
    this.dijkstraQueue.sort((a, b) => a.priority - b.priority);
    const current = this.dijkstraQueue.shift();
    const currentNode = this.findNode(current.node);

    if (!this.dijkstraVisited.has(currentNode.value)) {
      currentNode.processing = true;

      currentNode.connections.forEach(connection => {
        const neighbor = connection.node;
        const newDist = this.dijkstraDistances[currentNode.value] + connection.weight;

        if (newDist < this.dijkstraDistances[neighbor.value]) {
          // Update the global tracking objects
          this.dijkstraDistances[neighbor.value] = newDist;
          this.dijkstraPrevious[neighbor.value] = currentNode.value;

          // Directly update the node's properties for distance and predecessor
          neighbor.dist = newDist;
          neighbor.prev = currentNode; // Here, 'prev' is a reference to the node object

          // Update or add neighbor in the queue with the new priority
          const existingIndex = this.dijkstraQueue.findIndex(item => item.node === neighbor.value);
          if (existingIndex !== -1) {
            this.dijkstraQueue.splice(existingIndex, 1); // Remove the outdated entry
          }
          // Re-add the neighbor with the updated distance
          this.dijkstraQueue.push({ node: neighbor.value, priority: newDist });
        }
      });

      currentNode.processing = false;
      currentNode.visited = true;
      this.dijkstraVisited.add(currentNode.value);
    }

    // Sort the queue again after potential updates to ensure correct processing order
    this.dijkstraQueue.sort((a, b) => a.priority - b.priority);

    // Optionally, update dijkstraResults here if needed for visualization
    this.dijkstraResults = {
      distances: { ...this.dijkstraDistances },
      prev: { ...this.dijkstraPrevious }
    };
  }



  clearGraph() {
    this.nodes = [];
    this.draggedNode = null;
    this.selectedNode = null;
    this.startNode = null;
    this.endNode = null;
    this.dijkstraResults = null;
  }


  // In the Graph class
  setStartNode(node) {
    // Deselect any previous start node visually and logically
    if (this.startNode) {
      this.startNode.isStartNode = false;
    }
    // Set and mark the new start node
    this.startNode = node;
    node.isStartNode = true;

    // Initialize Dijkstra's algorithm with the new start node's value
    this.initializeDijkstra(node.value);
  }

  setEndNode(node) {
    // Deselect any previous start node visually and logically
    if (this.endNode) {
      this.endNode.isEndNode = false;
    }
    // Set and mark the new start node
    this.endNode = node;
    node.isEndNode = true;

  }





  // Connect two nodes by their values
  connectNodes(value1, value2) {
    const node1 = this.findNode(value1);
    const node2 = this.findNode(value2);
    if (node1 && node2) {
      node1.connect(node2);
    } else {
      console.error("One or both nodes not found");
    }
  }
  // Method to add a node to the graph
  addNode(value, position) {
    const newNode = new ViewerNode(value, position);
    this.nodes.push(newNode);
    return newNode; // Return the new node for reference
  }

  setStartNode(node) {
    if (this.startNode === node) {
      this.startNode.isStartNode = false; // Deselect the node
      this.startNode = null; // Clear the reference
    } else {
      if (this.startNode) {
        this.startNode.isStartNode = false; // Reset previous start node
      }
      this.startNode = node;
      node.isStartNode = true; // Mark new start node
    }
  }

  setEndNode(node) {
    if (this.endNode === node) {
      this.endNode.isEndNode = false; // Deselect the node
      this.endNode = null; // Clear the reference
    } else {
      if (this.endNode) {
        this.endNode.isEndNode = false; // Reset previous end node
      }
      this.endNode = node;
      node.isEndNode = true; // Mark new end node
    }
  }



  // Find a node by its value
  findNode(value) {
    return this.nodes.find(node => node.value === value);
  }


  displayData() {
    if (!appState.dataMode) return; // Exit if dataMode is not enabled
    this.nodes.sort((a, b) => a.dist === Infinity ? 1 : b.dist === Infinity ? -1 : a.dist - b.dist);
    push(); // Start a new drawing state
    strokeWeight(1);
    textFont('Tahoma');
    textSize(22);
    let startX = width - this.dataTableOffsetX; // Adjusted starting X position based on offset
    let startY = this.dataTableOffsetY; // Starting Y position from class property
    let rowHeight = 35; // Height of each row

    let maxNeighboursLength = 0;
    if (appState.neighbourInfoShow) {
      // Calculate the maximum length of neighbours list for adjusting column width
      this.nodes.forEach(node => {
        let neighboursList = node.connections.map(conn => conn.node.value).join(", ");
        let neighboursWidth = textWidth(neighboursList);
        if (neighboursWidth > maxNeighboursLength) {
          maxNeighboursLength = neighboursWidth;
        }
      });
    }

    maxNeighboursLength += 10; // Adding padding to maxNeighboursLength for aesthetics

    // Define columns dynamically based on neighbourInfoShow
    let columns = [
      { title: "NODE", width: 75 },
      { title: "DISTANCE", width: 120 },
      { title: "PARENT", width: 100 },
      { title: "VISITED", width: 100 }
    ];

    if (appState.neighbourInfoShow) {
      columns.push({ title: "NEIGHBOURS", width: Math.max(maxNeighboursLength, 150) }); // Ensuring at least 150px width for NEIGHBOURS column
    }

    // Display table headers
    columns.forEach(col => {
      fill(0); // Black background for headers
      rect(startX, startY, col.width, rowHeight);
      fill(255); // White text for headers
      textAlign(CENTER, CENTER);
      text(col.title, startX + col.width / 2, startY + rowHeight / 2);
      startX += col.width; // Move to the next column position for the next header
    });

    startY += rowHeight; // Adjust startY for the first row of data

    // Display data for each node
    this.nodes.forEach(node => {
      startX = width - this.dataTableOffsetX; // Reset startX for each row

      // Check if the node is in the open set (dijkstraQueue)
      const isInOpenSet = this.dijkstraQueue.some(queueItem => queueItem.node === node.value);

      let fillColor = '#ADD8E6'; // Default color for nodes
      if (node.visited) {
        fillColor = '#ffb6c1'; // Color for visited nodes
      } else if (isInOpenSet) {
        fillColor = '#98FB98'; // Color for nodes in the open set
      }

      columns.forEach(col => {
        fill(fillColor); // Use fillColor for row background
        rect(startX, startY, col.width, rowHeight);
        fill(0); // Black text for data

        let data = '';
        switch (col.title) {
          case "NODE":
            data = node.value;
            break;
          case "DISTANCE":
            data = node.dist === Infinity ? "∞" : node.dist.toString();
            break;
          case "PARENT":
            data = node.prev ? node.prev.value : "None";
            break;
          case "VISITED":
            data = node.visited ? "Yes" : "No";
            break;
          case "NEIGHBOURS":
            if (appState.neighbourInfoShow) {
              data = node.connections.map(conn => conn.node.value).join(", ");
            }
            break;
        }

        textAlign(CENTER, CENTER);
        text(data, startX + col.width / 2, startY + rowHeight / 2);
        startX += col.width; // Move to the next column position for the next data
      });

      startY += rowHeight; // Move to the next row position for the next node
    });

    pop(); // Restore original drawing state
  }



  display() {
    push()
    scale(scaleFactor)

    if (this.algorithmState == 1 && this.endNode != null && graph.dijkstraQueue.length == 0) {
      this.displayPath();
    }
    strokeWeight(3);
    textAlign(CENTER, CENTER);
    // Draw connections
    this.nodes.forEach(node => {
      node.connections.forEach(connection => {

        strokeWeight(1);
        line(node.position.x, node.position.y, connection.node.position.x, connection.node.position.y);

        // Drawing weight
        push();
        fill(190); // Background color for weight text
        noStroke();
        //let s = textWidth(connection.weight + '')
        ellipse((node.position.x + connection.node.position.x) / 2, (node.position.y + connection.node.position.y) / 2, 30);
        pop();
        textSize(17);
        fill(0); // Text color for weight
        stroke(0);
        strokeWeight(1);
        text(connection.weight, (node.position.x + connection.node.position.x) / 2, (node.position.y + connection.node.position.y) / 2);
      });
    });

    // Draw nodes
    this.nodes.forEach(node => {
      let fillColor = '#ADD8E6'; // Default color for nodes

      if (node.visited) {
        fillColor = '#ffb6c1'; // Visited nodes
      }

      const isInQueue = this.dijkstraQueue.some(queueItem => queueItem.node === node.value);
      if (isInQueue && !node.visited) {
        fillColor = '#98FB98'; // Pale green for nodes in the queue
      }
      if (graph.algorithmState != 1 && node.isStartNode) {
        //console.log(graph.algorithmState !=1,graph.algorithmState)
        fillColor = 'green'; // Start node

      }

      if (node.isStartNode) {
        push()
        fill(fillColor);
        stroke('green')
        strokeWeight(7)
        ellipse(node.position.x, node.position.y, 100);
        pop()
      } else if (node.isEndNode) {
        push()
        fill(fillColor);
        stroke('red')
        strokeWeight(7)
        ellipse(node.position.x, node.position.y, 100);
        pop()
      } else {
        push()
        fill(fillColor);
        strokeWeight(5)
        ellipse(node.position.x, node.position.y, 100); // Draw node
        pop()
      }
      //  fill(fillColor);

      if (this.algorithmState == 1) {
        // if(node.dist === Infinity){
        //   textSize(60)
        // }else{

        // }
        let infoText1 = node.dist === Infinity ? "∞" : node.dist.toString();
        let infoText2 = (node.prev && node.prev.value) ? node.prev.value : "None";


        push()
        textSize(20)
        if (node.dist === Infinity) {
          textSize(30)
        }

        text(infoText1, node.position.x, node.position.y + 10);
        textSize(20); // For distance and parent info
        text(infoText2, node.position.x, node.position.y + 30);
        textSize(45)
        // Node value and Dijkstra's path information
        fill(0); // Text color
        text(node.value, node.position.x, node.position.y - 20);
        pop();
      } else {

        textSize(60)
        // Node value and Dijkstra's path information
        fill(0); // Text color
        text(node.value, node.position.x, node.position.y);
      }

    });


    pop()
  }

  displayPath() {

    let current = this.endNode
    push()
    while (current.prev != null) {
      let from = current.position
      // console.log(current.prev)
      let to = current.prev.position
      strokeWeight(20)
      stroke(0)
      line(from.x, from.y, to.x, to.y)
      strokeWeight(25)
      stroke('blue')
      line(from.x, from.y, to.x, to.y)

      current = current.prev

    }
    pop()



  }




}


