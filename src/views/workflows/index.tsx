"use client"

import {
  addEdge,
  Background,
  Connection,
  Controls,
  Edge,
  MarkerType,
  MiniMap,
  Node,
  ReactFlow,
  useEdgesState,
  useNodesState,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import React, { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  CheckCircle2,
  GitFork,
  Trash2,
  UserCheck
} from "lucide-react"
import { ActionNode, ConditionNode, TriggerNode } from "./components/custom-nodes"

// Map custom nodes to React Flow
const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
}
interface WorkflowNodeData extends Record<string, unknown> {
  title: string
  desc: string
  type?: string
  status?: string
  badge?: string
  assignee?: string
}

type WorkflowNode = Node<WorkflowNodeData>

// Initial Nodes
const initialNodes: WorkflowNode[] = [
  {
    id: "trigger-node",
    type: "trigger",
    position: { x: 300, y: 20 },
    data: { title: "New Purchase Request", desc: "Form submit triggered" },
  },
  {
    id: "cond-1",
    type: "condition",
    position: { x: 300, y: 160 },
    data: { title: "Amount < $500", desc: "Rule check for small spend" },
  },
  {
    id: "act-1",
    type: "action",
    position: { x: 50, y: 320 },
    data: {
      title: "Auto Approve",
      desc: "No manager sign-off required",
      type: "action",
      status: "success",
      badge: "Integration",
    },
  },
  {
    id: "cond-2",
    type: "condition",
    position: { x: 550, y: 320 },
    data: { title: "Amount < $5,000", desc: "Rule check for mid spend" },
  },
  {
    id: "act-2",
    type: "action",
    position: { x: 300, y: 480 },
    data: {
      title: "Manager Approval",
      desc: "Requires reporting manager sign-off",
      type: "approval",
      assignee: "Manager",
    },
  },
  {
    id: "act-3",
    type: "action",
    position: { x: 800, y: 480 },
    data: {
      title: "Manager + Finance + CFO",
      desc: "Triple signature authorization",
      type: "approval",
      assignee: "CFO",
    },
  },
]

// Initial Edges
const initialEdges: Edge[] = [
  {
    id: "e1",
    source: "trigger-node",
    target: "cond-1",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { stroke: "#cbd5e1", strokeWidth: 2 },
  },
  {
    id: "e2",
    source: "cond-1",
    sourceHandle: "yes",
    target: "act-1",
    label: "Yes",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    labelStyle: { fill: "#10b981", fontWeight: 700, fontSize: 10 },
  },
  {
    id: "e3",
    source: "cond-1",
    sourceHandle: "no",
    target: "cond-2",
    label: "No",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { stroke: "#ef4444", strokeWidth: 2 },
    labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10 },
  },
  {
    id: "e4",
    source: "cond-2",
    sourceHandle: "yes",
    target: "act-2",
    label: "Yes",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { stroke: "#10b981", strokeWidth: 2 },
    labelStyle: { fill: "#10b981", fontWeight: 700, fontSize: 10 },
  },
  {
    id: "e5",
    source: "cond-2",
    sourceHandle: "no",
    target: "act-3",
    label: "No",
    type: "smoothstep",
    markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
    style: { stroke: "#ef4444", strokeWidth: 2 },
    labelStyle: { fill: "#ef4444", fontWeight: 700, fontSize: 10 },
  },
]

export function WorkflowsView() {
  const [nodes, setNodes, onNodesChange] = useNodesState<WorkflowNode>(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [activePolicy, setActivePolicy] = useState("Hardware Procurement Policy (Active)")

  // Auto clear toast
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  // Connection Handler
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "smoothstep",
            markerEnd: { type: MarkerType.ArrowClosed, color: "#94a3b8" },
            style: { stroke: "#cbd5e1", strokeWidth: 2 },
          },
          eds
        )
      ),
    [setEdges]
  )

  // Node Selection Handler
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id)
  }, [])

  // Spawns a new node to the canvas
  const handleAddNode = (type: "condition" | "approval") => {
    const id = `${type}-${Date.now()}`
    
    // Add offset positioning for readability
    const position = {
      x: 150 + Math.random() * 200,
      y: 100 + Math.random() * 200,
    }

    const newNode: WorkflowNode = {
      id,
      type: type === "condition" ? "condition" : "action",
      position,
      data: {
        title: type === "condition" ? "New Spending Check" : "New Approval Step",
        desc: type === "condition" ? "Specify spend limits" : "Required reviewer authorization",
        type: type === "condition" ? "condition" : "approval",
        assignee: type === "condition" ? undefined : "Manager",
      },
    }

    setNodes((nds) => [...nds, newNode])
    setSelectedNodeId(id)
    setToast(`Added ${type} step node to canvas`)
  }

  // Deletes node & related edges
  const handleDeleteNode = (id: string) => {
    setNodes((nds) => nds.filter((n) => n.id !== id))
    setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id))
    setSelectedNodeId(null)
    setToast("Removed node step from flow")
  }

  // Updates node values
  const updateNodeTitle = (id: string, title: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n
        return { ...n, data: { ...n.data, title } }
      })
    )
  }

  const updateNodeDesc = (id: string, desc: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n
        return { ...n, data: { ...n.data, desc } }
      })
    )
  }

  const updateNodeAssignee = (id: string, assignee: string) => {
    setNodes((nds) =>
      nds.map((n) => {
        if (n.id !== id) return n
        return {
          ...n,
          data: {
            ...n.data,
            assignee,
            desc: `Requires sign-off from ${assignee} role`,
          },
        }
      })
    )
  }

  const selectedNode = nodes.find((n) => n.id === selectedNodeId)

  return (
    <div className="space-y-6 animate-fade-in pb-12 relative h-full flex flex-col">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 shrink-0">
        <div className="text-left">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Approval Workflows</h1>
          <p className="text-xs text-muted-foreground mt-1">Design conditional compliance chains and routing rules.</p>
        </div>
        <div className="flex items-center space-x-3">
          <Select value={activePolicy} onValueChange={setActivePolicy}>
            <SelectTrigger className="w-64 h-9 border-input bg-card text-foreground text-xs font-semibold px-3">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="start">
              <SelectItem value="Hardware Procurement Policy (Active)">Hardware Procurement Policy (Active)</SelectItem>
              <SelectItem value="Default Spend Policy (Active)">Default Spend Policy (Active)</SelectItem>
              <SelectItem value="Marketing Spend Board (Draft)">Marketing Spend Board (Draft)</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={() => setToast("Workflow changes saved successfully!")}
            className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-lg text-xs font-semibold shadow-xs transition duration-150 h-9 cursor-pointer"
          >
            Save Policy
          </Button>
        </div>
      </div>

      {/* Notice Banner */}
      <div className="bg-indigo-50/70 dark:bg-indigo-950/20 border border-indigo-100/30 dark:border-indigo-900/30 rounded-xl p-4 flex items-start space-x-3 text-xs text-indigo-700 dark:text-indigo-400 shrink-0 text-left">
        <span className="text-base leading-none">💡</span>
        <div>
          <span className="font-extrabold">Pro-Tip:</span> Drag nodes around the canvas to restructure the decision tree. Draw connecting lines between node handles to create custom Yes/No branching paths. Click any node to configure its rule thresholds, titles, and assignee roles in the sidebar property inspector.
        </div>
      </div>

      {/* Editor Workspace */}
      <div className="flex border border-border rounded-2xl bg-muted/20 overflow-hidden relative min-h-[550px] flex-1">
        {/* Left Add Node Floating Panel */}
        <Card className="absolute top-4 left-4 z-10 w-52 border-border shadow-md bg-card/95 backdrop-blur-xs text-card-foreground">
          <CardContent className="p-4 space-y-3.5 text-left">
            <h3 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Add Node</h3>
            
            {/* Condition Add Button */}
            <button
              onClick={() => handleAddNode("condition")}
              className="w-full text-left p-3.5 border border-border rounded-lg hover:border-amber-400 hover:bg-amber-50/10 transition flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                <GitFork className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-foreground group-hover:text-amber-600">Condition</h4>
                <p className="text-[9px] text-muted-foreground">Split based on rules</p>
              </div>
            </button>

            {/* Approval Add Button */}
            <button
              onClick={() => handleAddNode("approval")}
              className="w-full text-left p-3.5 border border-border rounded-lg hover:border-purple-400 hover:bg-purple-50/10 transition flex items-center space-x-3 group cursor-pointer"
            >
              <div className="w-7 h-7 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                <UserCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-foreground group-hover:text-purple-600">Approval</h4>
                <p className="text-[9px] text-muted-foreground">Require human review</p>
              </div>
            </button>
          </CardContent>
        </Card>

        {/* Interactive React Flow Canvas */}
        <div className="flex-1 relative h-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onNodeClick={onNodeClick}
            fitView
            minZoom={0.5}
            maxZoom={1.5}
            className="w-full h-full"
          >
            <Controls className="!bg-card !border-border !shadow-sm [&_button]:!bg-transparent [&_button]:!border-border [&_svg]:!fill-foreground" />
            <MiniMap className="!bg-card !border-border !shadow-sm !rounded-lg" />
            <Background gap={12} size={1} className="!bg-muted/10 opacity-70" />
          </ReactFlow>
        </div>

        {/* Sidebar Inspector Panel */}
        {selectedNode && (
          <div className="w-80 bg-card border-l border-border flex flex-col z-10 shadow-2xl animate-slide-in text-foreground shrink-0 text-left">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h3 className="font-extrabold text-sm text-foreground">Node Properties</h3>
              <Button
                variant="ghost"
                onClick={() => setSelectedNodeId(null)}
                className="text-muted-foreground hover:text-foreground text-sm font-bold w-6 h-6 p-0 min-w-0"
              >
                &times;
              </Button>
            </div>
            <div className="p-5 space-y-5 flex-1 overflow-y-auto">
              <div>
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Node Type
                </label>
                <span className="inline-block mt-2 px-2.5 py-0.5 bg-muted border border-border text-foreground text-[9px] rounded-full font-bold uppercase tracking-wider">
                  {selectedNode.type}
                </span>
              </div>
              
              {/* Title input */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Display Name
                </label>
                <Input
                  value={selectedNode.data.title || ""}
                  onChange={(e) => updateNodeTitle(selectedNode.id, e.target.value)}
                  className="w-full text-xs font-semibold p-2.5"
                />
              </div>

              {/* Desc input */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  value={selectedNode.data.desc || ""}
                  onChange={(e) => updateNodeDesc(selectedNode.id, e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 border border-input rounded-md bg-transparent focus:ring-1 focus:ring-ring focus:border-ring focus:outline-none resize-none h-24"
                />
              </div>

              {/* Assignee select (only if approval type action) */}
              {selectedNode.data.type === "approval" && (
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-bold text-muted-foreground uppercase tracking-widest">
                    Assignee Rule
                  </label>
                  <Select
                    value={selectedNode.data.assignee || "Manager"}
                    onValueChange={(val) => updateNodeAssignee(selectedNode.id, val)}
                  >
                    <SelectTrigger className="w-full h-10 border-input bg-background text-foreground text-xs font-semibold justify-between px-3">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent position="popper" align="start">
                      <SelectItem value="Manager">Direct Reporting Manager</SelectItem>
                      <SelectItem value="Finance Team">Finance Operations Team</SelectItem>
                      <SelectItem value="CFO">Marcus Chen (CFO)</SelectItem>
                      <SelectItem value="IT SecOps">IT Security Operations</SelectItem>
                      <SelectItem value="Legal & Counsel">Legal General Counsel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Delete Node (don't delete trigger) */}
              {selectedNode.id !== "trigger-node" && (
                <div className="pt-4 border-t border-border">
                  <Button
                    onClick={() => handleDeleteNode(selectedNode.id)}
                    variant="destructive"
                    className="w-full text-xs font-bold flex items-center justify-center space-x-1.5 h-9"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Step Node</span>
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2 animate-slide-in text-xs font-bold border dark:border-slate-200">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  )
}
export default WorkflowsView
