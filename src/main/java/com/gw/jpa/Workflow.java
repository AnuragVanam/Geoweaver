package com.gw.jpa;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Workflow {
	
	@Id
//	@GeneratedValue(strategy=GenerationType.AUTO)
	private String id;
	
	private String name,  owner;

	@Column(columnDefinition = "LONGTEXT")	
	private String edges;

	@Column(columnDefinition = "LONGTEXT")
	private String nodes;

	@Column(columnDefinition = "LONGTEXT")
	private String description;
	

	public String getOwner() {
		return owner;
	}

	public void setOwner(String owner) {
		this.owner = owner;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNodes() {
		return nodes;
	}

	public void setNodes(String nodes) {
		this.nodes = nodes;
	}

	public String getEdges() {
		return edges;
	}

	public void setEdges(String edges) {
		this.edges = edges;
	}
	
	
	
}
