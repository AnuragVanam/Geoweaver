/**
 * author: Ziheng Sun
 * date: 20180925
 */
GW.workspace = {
		
		theGraph: null,
		
		currentmode: 1, //1: normal; 2: monitor
		
		jsFrame: new JSFrame({parentElement: $('#jsframe-container')[0]}),
		
		resizeIframe: function(obj){
			
//			setTimeout(function(){
//				
//				obj.style.height = obj.contentWindow.document.documentElement.scrollHeight + 'px';
//				
//				console.log("The content height is " + obj.contentWindow.document.documentElement.scrollHeight);
//				
//				console.log("The height is updated");
//				
//			}, 2000); //wait 2 seconds
			
			
			
		},
		
		openModalWindow:function() {
			
			$("#toolbar-left").css('z-index', 1);
			
			$("#test-jsframe").addClass("fa-shower");
			
			var content = "<div height=\"100%\">"+
			"<iframe width=\"100%\" height=\"600\" frameborder=\"0\" scrolling=\"no\" onload=\"GW.workspace.resizeIframe(this)\" "+
			" id=\"jupyter-iframe\" src=\"/Geoweaver/web/jupyter-proxy/\"></iframe>"+
			"</div>";
				
//			$.get("http://geobrain.csiss.gmu.edu/jupyter", function (response){ 
//				var html = response;
//				var html_src = 'data:text/html;charset=utf-8,' + html;
//				$("#jupyter-iframe").attr("src" , html_src);
//			});
			
			GW.process.createJSFrameDialog(720, 640, content, "Test Jupyter Notebook Server");
			
//	        const jsFrame = new JSFrame({parentElement: $('#jsframe-container')[0]});
////	        const innerHTML = '<div class="modal-header">' +
////	            '<h6 class="modal-title">Do want to save ?</h6>' +
////	            '</div>' +
////	            '<div class="modal-footer">' +
////	            '<button id="bt_submit" type="button" class="btn btn-outline-primary">OK</button>' +
////	            '<button id="bt_cancel" type="button" class="btn btn-outline-secondary">Cancel</button>' +
////	            '</div>';
//	        const innerHTML = '<div style="padding:10px; font-size: 12px;">Your contents here.</div>'
//
//	        const modalFrame = jsFrame.create({
//	            name: 'my-modal-window',
//	            title: 'Confirmation',
//	            appearanceName: 'yosemite',
//	            left: 0, top: 0, width: 320, height: 150,
//	            style: {
//                    backgroundColor: 'rgb(255,255,255)',
//                    overflow:'auto'
//
//                },
//	            movable: true,
//	            resizable: true,
//	            html: innerHTML
//	        });
//	        modalFrame.setControl({
//                styleDisplay:'inline',
//                maximizeButton: 'zoomButton',
//                demaximizeButton: 'dezoomButton',
//                minimizeButton: 'minimizeButton',
//                deminimizeButton: 'deminimizeButton',
//                hideButton: 'closeButton',
//                animation: true,
//                animationDuration: 150,
//
//            });
//	        //Place window in the center
//	        modalFrame.setPosition(window.innerWidth / 2, window.innerHeight / 2, 'CENTER_BOTTOM');
//
//
//	        //Handling the button's click event
//	        modalFrame.on('#bt_submit', 'click', (_frame, e) => {
//	            _frame.extra = {
//	                result: 'submitted'
//	            }
//	            _frame.closeFrame();
//	        });
//	        modalFrame.on('#bt_cancel', 'click', (frame, e) => {
//	            //You can also get frame object from JSFrame object.
//	            var _frame = jsFrame.getWindowByName('my-modal-window');
//	            _frame.extra = {
//	                result: 'canceled'
//	            }
//	            _frame.closeFrame();
//	        });
//
////	        //Open as modal window
////	        modalFrame.showModal(_frame => {
////	            //You can get callback when closing the modal window
////	            jsFrame.showToast({
////	                html: `${_frame.getName()} is closed.The result is ${_frame.extra.result}`,
////	                align: 'center',
////	                duration: 2000
////	            });
////	        });
//	        
//	        modalFrame.show()


	    },
		
		/**
		 * Create a new GraphCreator object
		 * @svg SVG object
		 * @nodes 
		 * @edges
		 */
		GraphCreator : function(svg, nodes, edges){
    	    var thisGraph = this;
    	        thisGraph.idct = 0;
    	    
    	    thisGraph.nodes = nodes || [];
    	    thisGraph.edges = edges || [];
    	    
    	    thisGraph.state = {
    	      selectedNode: null,
    	      selectedEdge: null,
    	      mouseDownNode: null,
    	      mouseDownLink: null,
    	      justDragged: false,
    	      justScaleTransGraph: false,
    	      lastKeyDown: -1,
    	      shiftNodeDrag: false,
    	      selectedText: null
    	    };

    	    // define arrow markers for graph links
    	    var defs = svg.append('svg:defs');
    	    defs.append('svg:marker')
    	      .attr('id', 'end-arrow')
    	      .attr('viewBox', '0 -5 10 10')
    	      .attr('refX', "32")
    	      .attr('markerWidth', 3.5)
    	      .attr('markerHeight', 3.5)
    	      .attr('orient', 'auto')
    	      .append('svg:path')
    	      .attr('d', 'M0,-5L10,0L0,5');

    	    // define arrow markers for leading arrow
    	    defs.append('svg:marker')
    	      .attr('id', 'mark-end-arrow')
    	      .attr('viewBox', '0 -5 10 10')
    	      .attr('refX', 7)
    	      .attr('markerWidth', 3.5)
    	      .attr('markerHeight', 3.5)
    	      .attr('orient', 'auto')
    	      .append('svg:path')
    	      .attr('d', 'M0,-5L10,0L0,5');

    	    thisGraph.svg = svg;
    	    thisGraph.svgG = svg.append("g")
    	          .classed(thisGraph.consts.graphClass, true);
    	    var svgG = thisGraph.svgG;

    	    // displayed when dragging between nodes
    	    thisGraph.dragLine = svgG.append('svg:path')
    	          .attr('class', 'link dragline hidden')
    	          .attr('d', 'M0,0L0,0')
    	          .style('marker-end', 'url(#mark-end-arrow)');

    	    // svg nodes and edges 
    	    thisGraph.paths = svgG.append("g").selectAll("g");
    	    thisGraph.circles = svgG.append("g").selectAll("g");
    	    
    	    thisGraph.drag = d3.behavior.drag()
    	          .origin(function(d){
    	            return {x: d.x, y: d.y};
    	          })
    	          .on("drag", function(args){
    	            thisGraph.state.justDragged = true;
    	            thisGraph.dragmove.call(thisGraph, args);
    	          })
    	          .on("dragend", function() {
    	            // todo check if edge-mode is selected
    	          });
    	    
    	    // listen for key events
    	    d3.select(window).on("keydown", function(){
    	    	
    	    	switch (d3.event.keyCode) {
	    	        case 8: //backspace = 8
	
	    	          // BACKSPACE_KEY was fired in <input id="textbox">
	    	          if(d3.event.target.nodeName.toLowerCase() === 'input') {

		    	          event.stopPropagation();
		    	          return;
	    	          }    
	    	          
	    	   }
    	    	
    	    	thisGraph.svgKeyDown.call(thisGraph);
    	    })
    	    .on("keyup", function(){
    	      thisGraph.svgKeyUp.call(thisGraph);
    	    });
    	    svg.on("mousedown", function(d){thisGraph.svgMouseDown.call(thisGraph, d);});
    	    svg.on("mouseup", function(d){thisGraph.svgMouseUp.call(thisGraph, d);});

    	    // listen for dragging
    	    var dragSvg = d3.behavior.zoom()
    	          .on("zoom", function(){
    	            if (d3.event.sourceEvent.shiftKey){
    	              // TODO  the internal d3 state is still changing
    	              return false;
    	            } else{
    	              thisGraph.zoomed.call(thisGraph);
    	            }
    	            return true;
    	          })
    	          .on("zoomstart", function(){
    	            var ael = d3.select("#" + thisGraph.consts.activeEditId).node();
    	            if (ael){
    	              ael.blur();
    	            }
    	            if (!d3.event.sourceEvent.shiftKey) d3.select('body').style("cursor", "move");
    	          })
    	          .on("zoomend", function(){
    	            d3.select('body').style("cursor", "auto");
    	          });
    	    
    	    svg.call(dragSvg).on("dblclick.zoom", null);

    	    // listen for resize
    	    window.onresize = function(){thisGraph.updateWindow(svg);};

    	    // handle download data
    	    d3.select("#download-input").on("click", function(){
    	      if(thisGraph.nodes.length!=0){
    	    	  var saveEdges = [];
        	      thisGraph.edges.forEach(function(val, i){
        	        saveEdges.push({source: val.source.id, target: val.target.id});
        	      });
        	      var blob = new Blob([window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})], 
        	    		  {type: "text/plain;charset=utf-8"});
        	      window.saveAs(blob, "geoweaver.json");
    	      }else{
    	    	  alert("No nodes are present!");
    	      }
    	      
    	    });
    	    
    	    d3.select("#save-workflow").on("click", function(){
    	    	
      	      if(thisGraph.nodes.length!=0){
      	    	  
      	    	  var saveEdges = [];
      	    	  
          	      thisGraph.edges.forEach(function(val, i){
          	        saveEdges.push({source: val.source, target: val.target});
          	      });
          	      
          	      GW.workflow.save(thisGraph.nodes, saveEdges);
//          	      var blob = new Blob([window.JSON.stringify({"nodes": thisGraph.nodes, "edges": saveEdges})], 
//          	    		  {type: "text/plain;charset=utf-8"});
//          	      window.saveAs(blob, "geoweaver.json");
      	      }else{
      	    	  alert("No nodes are present!");
      	      }
      	      
      	    });
    	    
    	    d3.select("#execute-workflow").on("click", function(){
    	    	
    	    	//if the current workspace is loaded with an existing workflow, run it directly. Otherwise, save the workflow first.
    	    	if(GW.workflow.loaded_workflow==null){
    	    		
        	    	GW.workflow.newDialog(true);
        	    	
    	    	}else{
    	    		
    	    		GW.workflow.run(GW.workflow.loaded_workflow);
    	    		
    	    	}
    	    	
    	    });
    	    
    	    d3.select("#geoweaver-result").on("click", function(){
    	    	
    	    	//get the selected node id
    	    	
//    	    	var selectedNode = GW.workspace.theGraph.state.selectedNode;
//    	    	
//    	    	if(selectedNode == null){
//    	    		
//    	    		alert("No process is selected");
//    	    		
//    	    	}else{
//    	    		GW.workflow.showProcessLog(GW.monitor.historyid, selectedNode.id);
//    	    	}
    	    	
    	    	GW.result.showDialog("");
    	    	
    	    });
    	    
    	    d3.select("#geoweaver-log").on("click", function(){
    	    	
    	    	//get the selected node id
    	    	
    	    	var selectedNode = GW.workspace.theGraph.state.selectedNode;
    	    	
    	    	if(selectedNode == null){
    	    		
    	    		alert("No process is selected");
    	    		
    	    	}else{
    	    		
    	    		GW.workflow.showProcessLog(GW.monitor.historyid, selectedNode.id);
    	    		
    	    	}
    	    	
    	    });
    	    
    	    d3.select("#geoweaver-details").on("click", function(){
    	    	
    	    	//get the selected node id
    	    	
    	    	var selectedNode = GW.workspace.theGraph.state.selectedNode;
    	    	
    	    	if(selectedNode == null){
    	    		
    	    		alert("No process is selected");
    	    		
    	    	}else{
    	    		
	    			var id = selectedNode.id.split("-")[0];
	    			
	    			GW.menu.details(id, "process");
    	    		
    	    	}
    	    	
    	    });
    	    
    	    d3.select("#upload-input").on("click", function(){
    	        var $file_input = document.querySelector("input#hidden-file-upload");
    	    	document.getElementById("hidden-file-upload").click();
				$file_input.onchange = function (e) {
					debugger;
					var uploadFile = this.files[0];
					var filereader = new window.FileReader();
					
					filereader.onload = function(){
					  var txtRes = filereader.result;
					  // TODO better error handling
					  try{
						var jsonObj = JSON.parse(txtRes);
						thisGraph.deleteGraph(true);
						thisGraph.nodes = jsonObj.nodes;
						thisGraph.setIdCt(jsonObj.nodes.length + 1);
						var newEdges = jsonObj.edges;
						newEdges.forEach(function(e, i){
						  newEdges[i] = {source: thisGraph.nodes.filter(function(n){return n.id == e.source;})[0],
									  target: thisGraph.nodes.filter(function(n){return n.id == e.target;})[0]};
						});
						thisGraph.edges = newEdges;
						thisGraph.updateGraph();
					  }catch(err){
						window.alert("Error parsing uploaded file\nerror message: " + err.message);
						return;
					  }
					};
					filereader.readAsText(uploadFile);
					
					///load_file(this.files[0]);
				};
    	    
    	    });
    	    
    	    d3.select("#test-jsframe").on('click', function(){
    	    	
    	    	GW.workspace.openModalWindow();
    	    	
//    	    	const frame = GW.workspace.jsFrame.create({
//    	    		title: 'Test Window',
//    	    	    left: 120, 
//    	    	    top: 120, 
//    	    	    width: 620, 
//    	    	    height: 560,
//    	    	    zIndex: 199,
//    	    	    appearanceName: 'yosemite',
////    	    	    url: 'geoweaver.html',//URL to display in iframe
//    	    	    //urlLoaded:Callback function called after loading iframe
////    	    	    urlLoaded: (frame) => {
////    	    	      //Called when the url finishes loading
////    	    	    }
////    	    	    title: 'Window',
////    	    	    left: 20, top: 20, width: 320, height: 220,
////    	    	    movable: true,//Enable to be moved by mouse
////    	    	    resizable: true,//Enable to be resized by mouse
////    	    	    html: '<div id="my_element" style="padding:10px;font-size:12px;color:darkgray;">Contents of window</div>'
//    	    	});
//    	    	
//    	    	frame.setControl({
//    	            maximizeButton: 'maximizeButton',
//    	            demaximizeButton: 'restoreButton',
//    	            minimizeButton: 'minimizeButton',
//    	            deminimizeButton: 'deminimizeButton',
//    	            animation: true,
//    	            animationDuration: 200,
//
//    	        });
//    	    	
//                frame.on('closeButton', 'click', (_frame, evt) => {
//                	alert("click button is clicked");
//                    _frame.closeFrame();
//                    
//                });
//                
//    	    	//Show the window
//    	    	frame.show();
    	    	
    	    });

			d3.select("#upload-input123").on("click", function(){
				debugger;

			});
    	    
    	    d3.select("#upload-input123").on("click", function(){
				debugger;
    	      if (window.File && window.FileReader && window.FileList && window.Blob) {
    	        var uploadFile = this.files[0];
    	        var filereader = new window.FileReader();
    	        
    	        filereader.onload = function(){
    	          var txtRes = filereader.result;
    	          // TODO better error handling
    	          try{
    	            var jsonObj = JSON.parse(txtRes);
    	            thisGraph.deleteGraph(true);
    	            thisGraph.nodes = jsonObj.nodes;
    	            thisGraph.setIdCt(jsonObj.nodes.length + 1);
    	            var newEdges = jsonObj.edges;
    	            newEdges.forEach(function(e, i){
    	              newEdges[i] = {source: thisGraph.nodes.filter(function(n){return n.id == e.source;})[0],
    	                          target: thisGraph.nodes.filter(function(n){return n.id == e.target;})[0]};
    	            });
    	            thisGraph.edges = newEdges;
    	            thisGraph.updateGraph();
    	          }catch(err){
    	            window.alert("Error parsing uploaded file\nerror message: " + err.message);
    	            return;
    	          }
    	        };
    	        filereader.readAsText(uploadFile);
    	        
    	      } else {
    	        alert("Your browser won't let you save this graph -- try upgrading your browser to IE 10+ or Chrome or Firefox.");
    	      }

    	    });

    	    // handle delete graph
    	    d3.select("#delete-graph").on("click", function(){
    	      thisGraph.deleteGraph(false);
    	    });
    	    
    	
		}, 
		
		/**
		 * Add listeners to the GraphCreator
		 */
		addListeners: function(){
			  
			  GW.workspace.GraphCreator.prototype.setIdCt = function(idct){
	    	    this.idct = idct;
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.consts =  {
	    	    selectedClass: "selected",
	    	    connectClass: "connect-node",
	    	    circleGClass: "conceptG",
	    	    graphClass: "graph",
	    	    activeEditId: "active-editing",
	    	    BACKSPACE_KEY: 8,
	    	    DELETE_KEY: 46,
	    	    ENTER_KEY: 13,
	    	    nodeRadius: 50
	    	  };
	
	    	  /* PROTOTYPE FUNCTIONS */
	    	  
	    	  GW.workspace.GraphCreator.prototype.dragmove = function(d) {
	    	    var thisGraph = this;
	    	    if (thisGraph.state.shiftNodeDrag){
	    	      thisGraph.dragLine.attr('d', 'M' + d.x + ',' + d.y + 'L' + d3.mouse(thisGraph.svgG.node())[0] + ',' + d3.mouse(this.svgG.node())[1]);
	    	    } else{
	    	      d.x += d3.event.dx;
	    	      d.y +=  d3.event.dy;
	    	      thisGraph.updateGraph();
	    	    }
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.deleteGraph = function(skipPrompt){
	    	    var thisGraph = this,
	    	        doDelete = true;
	    	    
	    	    //if some objects are selected, delete the selected only. If nothing selected, delete all.
	    	    if(thisGraph.state.selectedEdge){
	    	    	
	    	    	//removing an edge is much easier than removing a process
	    	        thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
	    	        state.selectedEdge = null;
	    	        thisGraph.updateGraph();
	    	        
	    	    }else if(thisGraph.state.selectedNode){
	    	    	
	    	    	var pid = thisGraph.state.selectedNode.id;
	    	    	console.log("going to remove process: " + pid);
	    	    	thisGraph.removeNode(pid);
	    	    	
	    	    }else{
	    	    	
	    	    	if (!skipPrompt){
	    	    		
	  	    	      doDelete = window.confirm("Warning: everything in work area will be erased!!! Press OK to proceed.");
	  	    	    }
	  	    	    if(doDelete){
	  	    	      
	  	    	      thisGraph.nodes = [];
	  	    	      thisGraph.edges = [];
	  	    	      thisGraph.updateGraph();
	  	    	      
	  	    	    }
	    	    	
	    	    }
	    	    
	    	    
	    	  };
	    	  
	    	  //add on 11/2/2018
	    	  GW.workspace.GraphCreator.prototype.load = function(workflow){
	    		  
	    		  try{
	    			  
	    			console.log("Start to load workflow..");
	    			
    	            var jsonObj = workflow;
    	            
    	            this.deleteGraph(true);
    	            
    	            var newNodes = $.parseJSON(jsonObj.nodes);
    	            
    	            //remove the old color status - load a brand new workflow
    	            newNodes.forEach(function(e, i){
    	            	
    	            	newNodes[i].color = ""; 
    	            	
    	            });
    	            
    	            this.nodes = newNodes;
    	            
    	            this.setIdCt(jsonObj.nodes.length + 1);
    	            
    	            var newEdges = $.parseJSON(jsonObj.edges);
    	            
    	            newEdges.forEach(function(e, i){
    	            	
    	            	newEdges[i] = {source: GW.workspace.theGraph.nodes.filter(function(n){
    	            			return n.id == e.source.id;
    	            		})[0],
    	                
	            			target: GW.workspace.theGraph.nodes.filter(function(n){
	            				return n.id == e.target.id;
	            			})[0]};
    	            	
    	            });
    	            
    	            this.edges = newEdges;
    	            
    	            this.updateGraph();
    	            
    	          }catch(err){
    	            window.alert("Error parsing uploaded file\nerror message: " + err.message);
    	            return;
    	          }
	    		  
	    	  }
	
	    	  /* select all text in element: taken from http://stackoverflow.com/questions/6139107/programatically-select-text-in-a-contenteditable-html-element */
	    	  GW.workspace.GraphCreator.prototype.selectElementContents = function(el) {
	    	    var range = document.createRange();
	    	    range.selectNodeContents(el);
	    	    var sel = window.getSelection();
	    	    sel.removeAllRanges();
	    	    sel.addRange(range);
	    	  };
	
	
	    	  /* insert svg line breaks: taken from http://stackoverflow.com/questions/13241475/how-do-i-include-newlines-in-labels-in-d3-charts */
	    	  GW.workspace.GraphCreator.prototype.insertTitleLinebreaks = function (gEl, title) {
	    	    var words = title.split(/\s+/g),
	    	        nwords = words.length;
	    	    var el = gEl.append("text")
	    	          .attr("text-anchor","middle")
	    	          .attr("font-size", function(d) {
	    	              var len = title.substring(0, 50 / 3).length;
	    	              var size = 50/3;
	    	              size *= 10 / len;
	    	              size += 1;
	    	              return Math.round(size)+'px';
	    	          })
	    	          .attr("dy", "-" + (nwords-1)*7.5);
	
	    	    for (var i = 0; i < words.length; i++) {
	    	      var tspan = el.append('tspan').text(words[i]);
	    	      if (i > 0)
	    	        tspan.attr('x', 0).attr('dy', '15');
	    	    }
	    	  };
	
	    	  
	    	  // remove edges associated with a node
	    	  GW.workspace.GraphCreator.prototype.spliceLinksForNode = function(node) {
	    	    var thisGraph = this,
	    	        toSplice = thisGraph.edges.filter(function(l) {
	    	      return (l.source === node || l.target === node);
	    	    });
	    	    toSplice.map(function(l) {
	    	      thisGraph.edges.splice(thisGraph.edges.indexOf(l), 1);
	    	    });
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.replaceSelectEdge = function(d3Path, edgeData){
	    	    var thisGraph = this;
	    	    d3Path.classed(thisGraph.consts.selectedClass, true);
	    	    if (thisGraph.state.selectedEdge){
	    	      thisGraph.removeSelectFromEdge();
	    	    }
	    	    thisGraph.state.selectedEdge = edgeData;
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.replaceSelectNode = function(d3Node, nodeData){
	    	    var thisGraph = this;
	    	    d3Node.classed(this.consts.selectedClass, true);
	    	    if (thisGraph.state.selectedNode){
	    	      thisGraph.removeSelectFromNode();
	    	    }
	    	    thisGraph.state.selectedNode = nodeData;
	    	    console.log("selected node changed : " + nodeData.id);
	    	  };
	    	  
	    	  GW.workspace.GraphCreator.prototype.removeSelectFromNode = function(){
	    	    var thisGraph = this;
	    	    thisGraph.circles.filter(function(cd){
	    	      return cd.id === thisGraph.state.selectedNode.id;
	    	    }).classed(thisGraph.consts.selectedClass, false);
	    	    thisGraph.state.selectedNode = null;
	    	    
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.removeSelectFromEdge = function(){
	    	    var thisGraph = this;
	    	    thisGraph.paths.filter(function(cd){
	    	      return cd === thisGraph.state.selectedEdge;
	    	    }).classed(thisGraph.consts.selectedClass, false);
	    	    thisGraph.state.selectedEdge = null;
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.pathMouseDown = function(d3path, d){
	    	    var thisGraph = this,
	    	        state = thisGraph.state;
	    	    d3.event.stopPropagation();
	    	    state.mouseDownLink = d;
	
	    	    if (state.selectedNode){
	    	      thisGraph.removeSelectFromNode();
	    	    }
	    	    
	    	    var prevEdge = state.selectedEdge;  
	    	    if (!prevEdge || prevEdge !== d){
	    	      thisGraph.replaceSelectEdge(d3path, d);
	    	    } else{
	    	      thisGraph.removeSelectFromEdge();
	    	    }
	    	  };
	
	    	  // mousedown on node
	    	  GW.workspace.GraphCreator.prototype.circleMouseDown = function(d3node, d){
	    	    var thisGraph = this,
	    	        state = thisGraph.state;
	    	    d3.event.stopPropagation();
	    	    state.mouseDownNode = d;
	    	    if (d3.event.shiftKey){
	    	      state.shiftNodeDrag = d3.event.shiftKey;
	    	      // reposition dragged directed edge
	    	      thisGraph.dragLine.classed('hidden', false)
	    	        .attr('d', 'M' + d.x + ',' + d.y + 'L' + d.x + ',' + d.y);
	    	      return;
	    	    }
	    	  };
	
	    	  /* place editable text on node in place of svg text */
	    	  GW.workspace.GraphCreator.prototype.changeTextOfNode = function(d3node, d){
	    	    var thisGraph= this,
	    	        consts = thisGraph.consts,
	    	        htmlEl = d3node.node();
	    	    d3node.selectAll("text").remove();
	    	    var nodeBCR = htmlEl.getBoundingClientRect(),
	    	        curScale = nodeBCR.width/consts.nodeRadius,
	    	        placePad  =  5*curScale,
	    	        useHW = curScale > 1 ? nodeBCR.width*0.71 : consts.nodeRadius*1.42;
	    	    // replace with editableconent text
	    	    var d3txt = thisGraph.svg.selectAll("foreignObject")
	    	          .data([d])
	    	          .enter()
	    	          .append("foreignObject")
	    	          .attr("x", nodeBCR.left + placePad )
	    	          .attr("y", nodeBCR.top + placePad)
	    	          .attr("height", 2*useHW)
	    	          .attr("width", useHW)
	    	          .append("xhtml:p")
	    	          .attr("id", consts.activeEditId)
	    	          .attr("contentEditable", "true")
	    	          .text(d.title)
	    	          .on("mousedown", function(d){
	    	            d3.event.stopPropagation();
	    	          })
	    	          .on("keydown", function(d){
	    	            d3.event.stopPropagation();
	    	            if (d3.event.keyCode == consts.ENTER_KEY && !d3.event.shiftKey){
	    	              this.blur();
	    	            }
	    	          })
	    	          .on("blur", function(d){
	    	            d.title = this.textContent;
	    	            thisGraph.insertTitleLinebreaks(d3node, d.title);
	    	            d3.select(this.parentElement).remove();
	    	          });
	    	    return d3txt;
	    	  };
	
	    	  // mouseup on nodes
	    	  GW.workspace.GraphCreator.prototype.circleMouseUp = function(d3node, d){
	    	    var thisGraph = this,
	    	        state = thisGraph.state,
	    	        consts = thisGraph.consts;
	    	    // reset the states
	    	    state.shiftNodeDrag = false;    
	    	    d3node.classed(consts.connectClass, false);
	    	    
	    	    var mouseDownNode = state.mouseDownNode;
	    	    
	    	    if (!mouseDownNode) return;
	
	    	    thisGraph.dragLine.classed("hidden", true);
	
	    	    if (mouseDownNode !== d){
	    	      // we're in a different node: create new edge for mousedown edge and add to graph
	    	      var newEdge = {source: mouseDownNode, target: d};
	    	      var filtRes = thisGraph.paths.filter(function(d){
	    	        if (d.source === newEdge.target && d.target === newEdge.source){
	    	          thisGraph.edges.splice(thisGraph.edges.indexOf(d), 1);
	    	        }
	    	        return d.source === newEdge.source && d.target === newEdge.target;
	    	      });
	    	      if (!filtRes[0].length){
	    	        thisGraph.edges.push(newEdge);
	    	        thisGraph.updateGraph();
	    	      }
	    	    } else{
	    	      // we're in the same node
	    	      if (state.justDragged) {
	    	        // dragged, not clicked
	    	        state.justDragged = false;
	    	      } else{
	    	        // clicked, not dragged
	    	        if (d3.event.shiftKey){
	    	          // shift-clicked node: edit text content
	    	          var d3txt = thisGraph.changeTextOfNode(d3node, d);
	    	          var txtNode = d3txt.node();
	    	          thisGraph.selectElementContents(txtNode);
	    	          txtNode.focus();
	    	        } else{
	    	          if (state.selectedEdge){
	    	            thisGraph.removeSelectFromEdge();
	    	          }
	    	          var prevNode = state.selectedNode;            
	    	          
	    	          if (!prevNode || prevNode.id !== d.id){
	    	            thisGraph.replaceSelectNode(d3node, d);
	    	          } else{
	    	            thisGraph.removeSelectFromNode();
	    	          }
	    	        }
	    	      }
	    	    }
	    	    state.mouseDownNode = null;
	    	    return;
	    	    
	    	  }; // end of circles mouseup
	
	    	  // mousedown on main svg
	    	  GW.workspace.GraphCreator.prototype.svgMouseDown = function(){
	    	    this.state.graphMouseDown = true;
	    	  };
	
	    	  // mouseup on main svg
	    	  GW.workspace.GraphCreator.prototype.svgMouseUp = function(){
	    	    var thisGraph = this,
	    	        state = thisGraph.state;
	    	    if (state.justScaleTransGraph) {
	    	      // dragged not clicked
	    	      state.justScaleTransGraph = false;
	    	    } else if (state.graphMouseDown && d3.event.shiftKey){
	    	      // clicked not dragged from svg
	    	      var xycoords = d3.mouse(thisGraph.svgG.node()),
	    	          d = {id: thisGraph.idct++, title: "new concept", x: xycoords[0], y: xycoords[1]};
	    	      thisGraph.nodes.push(d);
	    	      thisGraph.updateGraph();
	    	      // make title of text immediently editable
	    	      var d3txt = thisGraph.changeTextOfNode(thisGraph.circles.filter(function(dval){
	    	        return dval.id === d.id;
	    	      }), d),
	    	          txtNode = d3txt.node();
	    	      thisGraph.selectElementContents(txtNode);
	    	      txtNode.focus();
	    	    } else if (state.shiftNodeDrag){
	    	      // dragged from node
	    	      state.shiftNodeDrag = false;
	    	      thisGraph.dragLine.classed("hidden", true);
	    	    }
	    	    state.graphMouseDown = false;
	    	  };
	    	  
	    	  GW.workspace.GraphCreator.prototype.removeNode = function(pid) {
	    	    
	    		var thisGraph = this;
  	    		
	    	    var selectedNode = null;
  	    		
  	    		for(var i=0;i<thisGraph.nodes.length;i++){
  	    			
  	    			if(thisGraph.nodes[i].id == pid){
  	    			
  	    				selectedNode = thisGraph.nodes[i];
  	    				
  	    				thisGraph.nodes.splice(i, 1);
  	    				
  	    				break;
  	    			}
  	    			
  	    		}
  	    		
//    			thisGraph.nodes.splice(thisGraph.nodes.indexOf(selectedNode), 1);
    			thisGraph.spliceLinksForNode(selectedNode);
  	    		thisGraph.state.selectedNode = null;
  	    		thisGraph.updateGraph();
	    	  }
	    	  
	    	  GW.workspace.GraphCreator.prototype.removeNodes = function(pid) {
		    	    var thisGraph = this;
		    	    //remove the workspace object
    	    		var selectedNodes = thisGraph.getNodesById(pid);
    	    		for(var i=0;i<selectedNodes.length;i++){
    	    			thisGraph.nodes.splice(selectedNodes[i], 1);
    	    			thisGraph.spliceLinksForNode(selectedNodes[i]);
    	    		}
    	    		thisGraph.state.selectedNode = null;
    	    		thisGraph.updateGraph();
	    	  }
	
	    	  // keydown on main svg
	    	  GW.workspace.GraphCreator.prototype.svgKeyDown = function() {
	    		if(Object.keys(BootstrapDialog.dialogs).length){
	    			return; //if there are shown dialogs, key activity will be disconnected from svg
	    		}
	    	    var thisGraph = this,
	    	        state = thisGraph.state,
	    	        consts = thisGraph.consts;
	    	    // make sure repeated key presses don't register for each keydown
	    	    if(state.lastKeyDown !== -1) return;
	
	    	    state.lastKeyDown = d3.event.keyCode;
	    	    var selectedNode = state.selectedNode,
	    	        selectedEdge = state.selectedEdge;
	
	    	    switch(d3.event.keyCode) {
		    	    case consts.BACKSPACE_KEY:
		    	    case consts.DELETE_KEY:
		    	      d3.event.preventDefault();
		    	      if (selectedNode){
		    	        
		    	    	var pid = selectedNode.id;
		    	    	console.log("going to remove process: " + pid);
	//	    	    	GW.menu.del(pid, "process");
		    	    	thisGraph.removeNode(pid);
		    	    	
		    	      } else if (selectedEdge){
		    	    	
		    	    	//removing an edge is much easier than removing a process
		    	        thisGraph.edges.splice(thisGraph.edges.indexOf(selectedEdge), 1);
		    	        state.selectedEdge = null;
		    	        thisGraph.updateGraph();
		    	        
		    	      }
		    	      break;
	    	    }
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.svgKeyUp = function() {
	    		  if(Object.keys(BootstrapDialog.dialogs).length){
		    			return;
		    	  }
	    		  this.state.lastKeyDown = -1;
	    	  };
	
	    	  // call to propagate changes to graph
	    	  GW.workspace.GraphCreator.prototype.updateGraph = function(){
	    	    
	    	    var thisGraph = this,
	    	        consts = thisGraph.consts,
	    	        state = thisGraph.state;
	    	    
	    	    this.setIdCt(this.nodes.length);
	    	    
	    	    thisGraph.paths = thisGraph.paths.data(thisGraph.edges, function(d){
	    	      return String(d.source.id) + "+" + String(d.target.id);
	    	    });
	    	    var paths = thisGraph.paths;
	    	    // update existing paths
	    	    paths.style('marker-end', 'url(#end-arrow)')
	    	      .classed(consts.selectedClass, function(d){
	    	        return d === state.selectedEdge;
	    	      })
	    	      .attr("d", function(d){
	    	        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
	    	      });
	
	    	    // add new paths
	    	    paths.enter()
	    	      .append("path")
	    	      .style('marker-end','url(#end-arrow)')
	    	      .classed("link", true)
	    	      .attr("d", function(d){
	    	        return "M" + d.source.x + "," + d.source.y + "L" + d.target.x + "," + d.target.y;
	    	      })
	    	      .on("mousedown", function(d){
	    	        thisGraph.pathMouseDown.call(thisGraph, d3.select(this), d);
	    	        }
	    	      )
	    	      .on("mouseup", function(d){
	    	        state.mouseDownLink = null;
	    	      });
	
	    	    // remove old links
	    	    paths.exit().remove();
	    	    
	    	    // update existing nodes
	    	    thisGraph.circles = thisGraph.circles.data(thisGraph.nodes, function(d){ return d.id;});
	    	    thisGraph.circles.attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
	    	      .style("fill", function (d) { console.log("current color "+ d.id + " - " + d.color); return d.color; });
	
	    	    // add new nodes
	    	    var newGs= thisGraph.circles.enter()
	    	          .append("g");
	
	    	    newGs.classed(consts.circleGClass, true)
	    	      .attr("transform", function(d){return "translate(" + d.x + "," + d.y + ")";})
	    	      .on("mouseover", function(d){        
	    	        if (state.shiftNodeDrag){
	    	          d3.select(this).classed(consts.connectClass, true);
	    	        }
	    	      })
	    	      .on("mouseout", function(d){
	    	        d3.select(this).classed(consts.connectClass, false);
	    	      })
	    	      .on("mousedown", function(d){
	    	        thisGraph.circleMouseDown.call(thisGraph, d3.select(this), d);
	    	      })
	    	      .on("mouseup", function(d){
	    	        thisGraph.circleMouseUp.call(thisGraph, d3.select(this), d);
	    	      })
	    	      .call(thisGraph.drag);
	    	    
//	    	    console.log("update circile once");	
	    	    newGs.append("circle")
	    	      .attr("r", String(consts.nodeRadius))
//	    	      .attr("r", function(d) { return d.r; })
	    	      .style("fill", function (d) { console.log("current color "+ d.id + " - " + d.color); return d.color; }); //add color
	
	    	    newGs.each(function(d){
	    	      thisGraph.insertTitleLinebreaks(d3.select(this), d.title);
	    	    });
	
	    	    // remove old nodes
	    	    thisGraph.circles.exit().remove();
	    	  };
	
	    	  GW.workspace.GraphCreator.prototype.zoomed = function(){
	    	    this.state.justScaleTransGraph = true;
	    	    d3.select("." + this.consts.graphClass)
	    	      .attr("transform", "translate(" + d3.event.translate + ") scale(" + d3.event.scale + ")"); 
	    	  };
	    	  
	    	  GW.workspace.GraphCreator.prototype.addProcess = function(id, name){
		  			
	    		  	var thisGraph = this;
		  			//how to find a location
		  			
		  			var x = Math.floor(Math.random() * 900) + 1;
		  			
		  			var y = Math.floor(Math.random() * 600) + 1;
		  			
		  			var randomid = GW.workspace.makeid();
		  			
		  			var insid = id +"-"+ randomid;
		  			
		  			thisGraph.nodes.push({title: name, id: insid, x: x, y: y});
		  			
		  			thisGraph.updateGraph();
		  			
		  			console.log("new process added: " + insid);
		  			
		  			return insid;
		  			
		  	  };
		  	  
		  	  GW.workspace.GraphCreator.prototype.addEdge = function(frompid, topid){
		  			
		  		  	var thisGraph = this;
		  		  
		  			var fromnode = thisGraph.getNodeById(frompid);
		  			
		  			var tonode = thisGraph.getNodeById(topid);
		  			
		  			thisGraph.edges.push({source: fromnode, target: tonode});
		  			
		      };
		      
		      GW.workspace.GraphCreator.prototype.renderStatus = function(statusList){
		    	  
		    	  	console.log("monitor workflow status called");
		    	  	
		    	  	var newnodes = [];
		    	  
					for(var i=0;i<statusList.length;i++){
		        		
		        		//single node
		        		
		        		var id = statusList[i].id;
		        		
		        		var flag = statusList[i].status; //true or false
		        		
		        		var node = this.getNodeById(id);
		        		
		        		if(flag=="READY"){
		        			
		        			  node.color = "";
				    		  
				    	}else if(flag=="RUNNING"){
				    		  
				    		  node.color = "orange";
				    		  
				    	}else if(flag=="DONE"){
				    		  
				    		  node.color = "green";
				    		  
				    	}else if(flag=="FAILED"){
				    		  
				    		  node.color = "red";
				    		  
				    	}
		        		
		        		newnodes.push(node);
		        		
		        		GW.monitor.updateProgress(id, flag);
		        		
		        	}
					
					GW.workspace.theGraph.nodes = newnodes;
					
					GW.workspace.theGraph.updateGraph();
					
					console.log("circle should change its color");
					
		      }
	    	  /**
	    	   * NodeS
	    	   */
		      GW.workspace.GraphCreator.prototype.getNodesById = function(id){
		    	  
		    	var thisGraph = this;
		    		
	  			var thenodes = [];
	  			
	  			for(var i=0;i<thisGraph.nodes.length;i++){
	  				
	  				if(thisGraph.nodes[i].id.startsWith(id)){

	  					thenodes.push(thisGraph.nodes[i]);
	  					
	  				}
	  					
	  			}
	  			
	  			return thenodes;
		    	  
		      };
		      /**
		       * Node
		       */
	    	  GW.workspace.GraphCreator.prototype.getNodeById = function(id){
	    	
	    		var thisGraph = this;
	    		
	  			var thenode = null;
	  			
	  			for(var i=0;i<thisGraph.nodes.length;i++){
	  				
	  				if(thisGraph.nodes[i].id == id){

	  					thenode = thisGraph.nodes[i];
	  					
	  					break;
	  					
	  				}
	  					
	  			}
	  			
	  			return thenode;
	  			
	  		  };
	
	    	  GW.workspace.GraphCreator.prototype.updateWindow = function(svg){
	    	    var docEl = document.documentElement,
	    	        bodyEl = document.getElementsByTagName('body')[0];
	    	    var x = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth;
	    	    var y = window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
	    	    svg.attr("width", x).attr("height", y);
	    	  };
			
		},
		
		updateStatus: function(statusList){
			
			GW.workspace.theGraph.renderStatus(statusList);
			
		},
		
		/**
		 * check if the workspace has more than one processes
		 */
		checkIfWorkflow: function(){
			
			var workflow = false;
			
			if(this.theGraph.nodes.length>1){
				
				workflow = true;
				
			}
			
			return workflow;
			
		},
		
		makeid: function() {
			
			  var text = "";
			  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

			  for (var i = 0; i < 5; i++)
			    text += possible.charAt(Math.floor(Math.random() * possible.length));

			  return text;
		},
		
		
		init: function(){
			
			  GW.workspace.addListeners();
			  
	    	  /**** MAIN ****/
	
	    	  // warn the user when leaving
	    	  window.onbeforeunload = function(){
	    	    return "Make sure to save your graph locally before leaving :-)";
	    	  };      
	
	    	  var docEl = document.documentElement,
//	    	      bodyEl = document.getElementsByTagName('body')[0];
	    	  	  bodyEl = document.getElementById('workspace');
	    	  
	    	  var width = window.innerWidth || docEl.clientWidth || bodyEl.clientWidth,
	    	      height =  window.innerHeight|| docEl.clientHeight|| bodyEl.clientHeight;
	
	    	  var xLoc = width/2 - 25,
	    	      yLoc = 100;
	    	  
	    	  var nodes = [];
	    	  
	    	  var edges = [];
	    	  
	    	  /** MAIN SVG **/
	    	  var svg = d3.select("#workspace").append("svg")
	    	        .attr("width", width)
	    	        .attr("height", height);
	    	  
	    	  var format = d3.format(",d");
	    	  
	    	  this.theGraph = new GW.workspace.GraphCreator(svg, nodes, edges);
	    	  
	    	  this.theGraph.updateGraph();
			
		}
		
}

