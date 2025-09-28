"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Clock,
  BarChart,
  Search,
  Download,
  Upload,
  Plus,
  X,
  Moon,
  Sun,
  Timer,
  FileText,
  Target,
  Save,
  Trash,
} from "lucide-react"
import { staticRoadmapData } from "@/data/roadmap-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useTheme } from "next-themes"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Define types
interface RoadmapItem {
  title: string
  difficulty?: string
  timeEstimate: string
  completed?: boolean
  notes?: string
  actualTimeSpent?: number // in minutes
  startedAt?: string
  completedAt?: string
}

interface RoadmapSection {
  title: string
  items: RoadmapItem[]
}

export default function RoadmapTracker() {
  // Theme
  const { theme, setTheme } = useTheme()

  // Initialize state with data from localStorage if available, otherwise use the static data
  const [roadmapData, setRoadmapData] = useState<RoadmapSection[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const savedData = localStorage.getItem("roadmapData")
        if (savedData) {
          return JSON.parse(savedData)
        }
      } catch (error) {
        console.error("Error loading data from localStorage:", error)
      }
    }
    // Always return a valid array with the static data
    return staticRoadmapData.map((section) => ({
      ...section,
      items: section.items.map((item) => ({ ...item, completed: false })),
    }))
  })

  const [overallProgress, setOverallProgress] = useState(0)
  const [difficultyStats, setDifficultyStats] = useState<{ name: string; value: number; color: string }[]>([])
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredData, setFilteredData] = useState<RoadmapSection[]>(roadmapData)
  const [isAddingTopic, setIsAddingTopic] = useState(false)
  const [newTopic, setNewTopic] = useState<{
    sectionIndex: number
    title: string
    difficulty: string
    timeEstimate: string
  }>({
    sectionIndex: 0,
    title: "",
    difficulty: "Medium",
    timeEstimate: "3 hours",
  })
  const [activeTimer, setActiveTimer] = useState<{
    sectionIndex: number
    itemIndex: number
    startTime: number
    isRunning: boolean
  } | null>(null)
  const [selectedTopic, setSelectedTopic] = useState<{
    sectionIndex: number
    itemIndex: number
    item: RoadmapItem
  } | null>(null)
  const [focusMode, setFocusMode] = useState(false)
  const [focusTopics, setFocusTopics] = useState<
    {
      sectionTitle: string
      title: string
      difficulty?: string
      timeEstimate: string
      sectionIndex: number
      itemIndex: number
    }[]
  >([])

  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Save to localStorage whenever roadmapData changes
  useEffect(() => {
    localStorage.setItem("roadmapData", JSON.stringify(roadmapData))
    calculateOverallProgress()
    calculateDifficultyStats()
    filterData()
  }, [roadmapData, searchQuery])

  // Timer effect
  useEffect(() => {
    if (activeTimer && activeTimer.isRunning) {
      timerRef.current = setInterval(() => {
        const updatedData = [...roadmapData]
        const item = updatedData[activeTimer.sectionIndex].items[activeTimer.itemIndex]

        if (item) {
          const currentTimeSpent = item.actualTimeSpent || 0
          item.actualTimeSpent = currentTimeSpent + 1 // Add 1 minute
          setRoadmapData(updatedData)
        }
      }, 60000) // Update every minute
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [activeTimer])

  // Calculate focus topics
  useEffect(() => {
    if (focusMode) {
      // Find incomplete topics with prerequisites completed
      const topics = roadmapData
        .flatMap((section, sectionIndex) =>
          section && section.items
            ? section.items
                .filter((item, itemIndex) => {
                  // Filter logic: not completed and either:
                  // 1. It's the first item in a section, or
                  // 2. The previous item is completed
                  if (!item || item.completed) return false

                  if (itemIndex === 0) return true

                  const prevItem = section.items[itemIndex - 1]
                  return prevItem && prevItem.completed
                })
                .map((item, itemIndex) => ({
                  sectionTitle: section.title,
                  sectionIndex,
                  itemIndex,
                  ...item,
                }))
            : [],
        )
        .slice(0, 5)

      setFocusTopics(topics)
    }
  }, [focusMode, roadmapData])

  // Filter data based on search query
  const filterData = () => {
    if (!searchQuery.trim()) {
      setFilteredData(roadmapData)
      return
    }

    const query = searchQuery.toLowerCase()
    const filtered = roadmapData
      .map((section) => {
        if (!section || !section.items) return null

        const filteredItems = section.items.filter((item) => item && item.title.toLowerCase().includes(query))

        if (filteredItems.length === 0) return null

        return {
          ...section,
          items: filteredItems,
        }
      })
      .filter(Boolean) as RoadmapSection[]

    setFilteredData(filtered)
  }

  // Calculate overall progress
  const calculateOverallProgress = () => {
    if (!roadmapData || !Array.isArray(roadmapData)) {
      setOverallProgress(0)
      return
    }

    const totalItems = roadmapData.reduce(
      (acc, section) => acc + (section && section.items ? section.items.length : 0),
      0,
    )

    const completedItems = roadmapData.reduce(
      (acc, section) =>
        acc + (section && section.items ? section.items.filter((item) => item && item.completed).length : 0),
      0,
    )

    setOverallProgress(totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0)
  }

  // Calculate difficulty statistics for the chart
  const calculateDifficultyStats = () => {
    const stats = {
      Easy: { completed: 0, total: 0, color: "#10b981" },
      Medium: { completed: 0, total: 0, color: "#f59e0b" },
      Hard: { completed: 0, total: 0, color: "#ef4444" },
      Other: { completed: 0, total: 0, color: "#6366f1" },
    }

    if (!roadmapData) return []

    roadmapData.forEach((section) => {
      if (section && section.items) {
        section.items.forEach((item) => {
          if (item) {
            const difficulty = item.difficulty || "Other"
            stats[difficulty].total++
            if (item.completed) {
              stats[difficulty].completed++
            }
          }
        })
      }
    })

    const chartData = Object.entries(stats).map(([name, { completed, total, color }]) => ({
      name,
      value: total > 0 ? Math.round((completed / total) * 100) : 0,
      color,
      completed,
      total,
    }))

    setDifficultyStats(chartData)
  }

  // Toggle completion status of an item
  const toggleItemCompletion = (sectionIndex: number, itemIndex: number) => {
    const updatedData = [...roadmapData]
    const item = updatedData[sectionIndex].items[itemIndex]

    if (item) {
      const newCompletedState = !item.completed
      item.completed = newCompletedState

      // Add completion timestamp
      if (newCompletedState) {
        item.completedAt = new Date().toISOString()

        // Stop timer if it's running for this item
        if (activeTimer && activeTimer.sectionIndex === sectionIndex && activeTimer.itemIndex === itemIndex) {
          setActiveTimer(null)
        }

        toast({
          title: "Topic completed!.",
          description: `You've completed "${item.title}"`,
        })
      } else {
        item.completedAt = undefined
      }

      setRoadmapData(updatedData)
    }
  }

  // Calculate section progress
  const calculateSectionProgress = (section: RoadmapSection) => {
    if (!section || !section.items) return 0

    const totalItems = section.items.length
    const completedItems = section.items.filter((item) => item && item.completed).length
    return totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0
  }

  // Toggle section expansion
  const toggleSectionExpansion = (sectionTitle: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionTitle) ? prev.filter((title) => title !== sectionTitle) : [...prev, sectionTitle],
    )
  }

  // Get difficulty color
  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500"
      case "Medium":
        return "bg-amber-500"
      case "Hard":
        return "bg-red-500"
      default:
        return "bg-indigo-600"
    }
  }

  // Add new topic
  const addNewTopic = () => {
    if (!newTopic.title.trim()) {
      toast({
        title: "Error",
        description: "Topic title cannot be empty",
        variant: "destructive",
      })
      return
    }

    const updatedData = [...roadmapData]
    updatedData[newTopic.sectionIndex].items.push({
      title: newTopic.title,
      difficulty: newTopic.difficulty,
      timeEstimate: newTopic.timeEstimate,
      completed: false,
    })

    setRoadmapData(updatedData)
    setIsAddingTopic(false)
    setNewTopic({
      sectionIndex: 0,
      title: "",
      difficulty: "Medium",
      timeEstimate: "2 hours",
    })

    toast({
      title: "Topic added",
      description: `"${newTopic.title}" has been added to your roadmap`,
    })
  }

  // Export data
  const exportData = () => {
    const dataStr = JSON.stringify(roadmapData, null, 2)
    const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`

    const exportFileDefaultName = `roadmap-progress-${new Date().toISOString().slice(0, 10)}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()

    toast({
      title: "Export successful",
      description: "Your progress data has been exported",
    })
  }

  // Import data
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target?.result as string)
        setRoadmapData(importedData)
        toast({
          title: "Import successful",
          description: "Your progress data has been imported",
        })
      } catch (error) {
        toast({
          title: "Import failed",
          description: "The file format is invalid",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
  }

  // Toggle timer
  const toggleTimer = (sectionIndex: number, itemIndex: number) => {
    if (activeTimer && activeTimer.sectionIndex === sectionIndex && activeTimer.itemIndex === itemIndex) {
      // Stop the timer
      setActiveTimer(null)
      toast({
        title: "Timer stopped",
        description: `Timer for "${roadmapData[sectionIndex].items[itemIndex].title}" has been stopped`,
      })
    } else {
      // Start a new timer
      setActiveTimer({
        sectionIndex,
        itemIndex,
        startTime: Date.now(),
        isRunning: true,
      })

      // Set startedAt timestamp if not already set
      const updatedData = [...roadmapData]
      const item = updatedData[sectionIndex].items[itemIndex]
      if (item && !item.startedAt) {
        item.startedAt = new Date().toISOString()
        setRoadmapData(updatedData)
      }

      toast({
        title: "Timer started",
        description: `Tracking time for "${roadmapData[sectionIndex].items[itemIndex].title}"`,
      })
    }
  }

  // Save notes
  const saveNotes = () => {
    if (!selectedTopic) return

    const updatedData = [...roadmapData]
    updatedData[selectedTopic.sectionIndex].items[selectedTopic.itemIndex].notes = selectedTopic.item.notes

    setRoadmapData(updatedData)
    setSelectedTopic(null)

    toast({
      title: "Notes saved",
      description: "Your notes have been saved successfully!",
    })
  }

  // Format time
  const formatTime = (minutes?: number) => {
    if (!minutes) return "0 min"

    if (minutes < 60) {
      return `${minutes} min`
    }

    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60

    if (remainingMinutes === 0) {
      return `${hours} hr`
    }

    return `${hours} hr ${remainingMinutes} min`
  }

  // Delete topic
  const deleteTopic = (sectionIndex: number, itemIndex: number) => {
    const updatedData = [...roadmapData]
    updatedData[sectionIndex].items.splice(itemIndex, 1)
    setRoadmapData(updatedData)

    toast({
      title: "Topic deleted",
      description: "The topic has been removed from your roadmap",
    })
  }

  return (
    <div className="container mx-auto px-4 py-9">
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center justify-between w-full max-w-3xl mb-4">
          <h1 className="text-3xl font-bold">Learning Roadmap Tracker</h1>
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
                    {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle theme</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" onClick={exportData}>
                    <Download className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Export progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Input type="file" id="import-file" className="hidden" accept=".json" onChange={importData} />
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => document.getElementById("import-file")?.click()}
                    >
                      <Upload className="h-5 w-5" />
                    </Button>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Import progress</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={focusMode ? "default" : "outline"}
                    size="icon"
                    onClick={() => setFocusMode(!focusMode)}
                  >
                    <Target className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Focus mode</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <p className="text-slate-600 dark:text-slate-400 mb-4 text-center">
          Track your progress through the full-stack development journey
        </p>

        <div className="w-full max-w-3xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm font-medium">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>
      </div>

      {focusMode ? (
        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2" />
                Focus Mode: Suggested Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {focusTopics.length > 0 ? (
                  focusTopics.map((topic, index) => (
                    <Card key={index} className="bg-muted/40">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-medium">{topic.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {topic.sectionTitle} • {topic.timeEstimate}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => toggleTimer(topic.sectionIndex, topic.itemIndex)}
                            >
                              <Timer className="w-4 h-4 mr-1" />
                              Start
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => {
                                toggleItemCompletion(topic.sectionIndex, topic.itemIndex)
                                setFocusTopics(focusTopics.filter((_, i) => i !== index))
                              }}
                            >
                              Complete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No focus topics available. Complete some prerequisites or add new topics.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-center">
              <Button variant="outline" onClick={() => setFocusMode(false)}>
                Exit Focus Mode
              </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search topics..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7"
                    onClick={() => setSearchQuery("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Dialog open={isAddingTopic} onOpenChange={setIsAddingTopic}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Topic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Topic</DialogTitle>
                    <DialogDescription>Add a new topic to your learning roadmap.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="section">Section</Label>
                      <Select
                        value={newTopic.sectionIndex.toString()}
                        onValueChange={(value) => setNewTopic({ ...newTopic, sectionIndex: Number.parseInt(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a section" />
                        </SelectTrigger>
                        <SelectContent>
                          {roadmapData.map((section, index) => (
                            <SelectItem key={index} value={index.toString()}>
                              {section.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="title">Topic Title</Label>
                      <Input
                        id="title"
                        value={newTopic.title}
                        onChange={(e) => setNewTopic({ ...newTopic, title: e.target.value })}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="difficulty">Difficulty</Label>
                      <Select
                        value={newTopic.difficulty}
                        onValueChange={(value) => setNewTopic({ ...newTopic, difficulty: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="timeEstimate">Time Estimate</Label>
                      <Input
                        id="timeEstimate"
                        value={newTopic.timeEstimate}
                        onChange={(e) => setNewTopic({ ...newTopic, timeEstimate: e.target.value })}
                        placeholder="e.g., 2 hours, 3 days"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTopic(false)}>
                      Cancel
                    </Button>
                    <Button onClick={addNewTopic}>Add Topic</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="roadmap" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
                <TabsTrigger value="stats">Statistics</TabsTrigger>
              </TabsList>

              <TabsContent value="roadmap" className="space-y-4">
                <Accordion type="multiple" className="w-full" value={expandedSections}>
                  {filteredData && Array.isArray(filteredData) && filteredData.length > 0 ? (
                    filteredData.map((section, sectionIndex) =>
                      section ? (
                        <AccordionItem key={sectionIndex} value={section.title}>
                          <AccordionTrigger
                            onClick={() => toggleSectionExpansion(section.title)}
                            className="hover:no-underline"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center w-full">
                              <span className="font-medium text-left">{section.title}</span>
                              <div className="flex items-center ml-0 sm:ml-auto mt-2 sm:mt-0">
                                <span className="text-xs mr-2">{calculateSectionProgress(section)}%</span>
                                <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-emerald-500 rounded-full"
                                    style={{ width: `${calculateSectionProgress(section)}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="grid gap-3">
                              {section.items && Array.isArray(section.items)
                                ? section.items.map((item, itemIndex) =>
                                    item ? (
                                      <Card
                                        key={itemIndex}
                                        className={`transition-all ${item.completed ? "bg-slate-50 dark:bg-slate-800/50" : ""}`}
                                      >
                                        <CardContent className="p-4">
                                          <div className="flex items-start">
                                            <Checkbox
                                              id={`item-${sectionIndex}-${itemIndex}`}
                                              checked={item.completed || false}
                                              onCheckedChange={() => toggleItemCompletion(sectionIndex, itemIndex)}
                                              className="mt-1"
                                            />
                                            <div className="ml-3 flex-1">
                                              <div className="flex flex-wrap items-start justify-between gap-2">
                                                <label
                                                  htmlFor={`item-${sectionIndex}-${itemIndex}`}
                                                  className={`font-medium cursor-pointer ${item.completed ? "line-through text-slate-500 dark:text-slate-400" : ""}`}
                                                >
                                                  {item.title}
                                                </label>
                                                <div className="flex flex-wrap items-center gap-2">
                                                  {item.difficulty && (
                                                    <Badge variant="outline" className="text-xs">
                                                      <span
                                                        className={`w-2 h-2 rounded-full mr-1.5 ${getDifficultyColor(item.difficulty)}`}
                                                      ></span>
                                                      {item.difficulty}
                                                    </Badge>
                                                  )}
                                                  <Badge variant="outline" className="text-xs flex items-center">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    {item.timeEstimate}
                                                  </Badge>
                                                  {item.actualTimeSpent ? (
                                                    <Badge variant="secondary" className="text-xs flex items-center">
                                                      <Timer className="w-3 h-3 mr-1" />
                                                      {formatTime(item.actualTimeSpent)}
                                                    </Badge>
                                                  ) : null}
                                                </div>
                                              </div>
                                              {item.notes && (
                                                <div className="mt-2 text-sm text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-2 rounded-md">
                                                  {item.notes}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </CardContent>
                                        <CardFooter className="px-4 py-2 flex justify-end gap-2 border-t">
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() =>
                                                  setSelectedTopic({
                                                    sectionIndex,
                                                    itemIndex,
                                                    item: { ...item },
                                                  })
                                                }
                                              >
                                                <FileText className="w-4 h-4 mr-1" />
                                                Notes
                                              </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                              <DialogHeader>
                                                <DialogTitle>Notes for {selectedTopic?.item.title}</DialogTitle>
                                                <DialogDescription>
                                                  Add your notes, resources, or thoughts about this topic.
                                                </DialogDescription>
                                              </DialogHeader>
                                              <Textarea
                                                className="min-h-[200px]"
                                                placeholder="Add your notes here..."
                                                value={selectedTopic?.item.notes || ""}
                                                onChange={(e) =>
                                                  setSelectedTopic((prev) =>
                                                    prev
                                                      ? { ...prev, item: { ...prev.item, notes: e.target.value } }
                                                      : null,
                                                  )
                                                }
                                              />
                                              <DialogFooter>
                                                <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                                                  Cancel
                                                </Button>
                                                <Button onClick={saveNotes}>
                                                  <Save className="w-4 h-4 mr-1" />
                                                  Save Notes
                                                </Button>
                                              </DialogFooter>
                                            </DialogContent>
                                          </Dialog>

                                          <Button
                                            variant={
                                              activeTimer &&
                                              activeTimer.sectionIndex === sectionIndex &&
                                              activeTimer.itemIndex === itemIndex
                                                ? "default"
                                                : "ghost"
                                            }
                                            size="sm"
                                            onClick={() => toggleTimer(sectionIndex, itemIndex)}
                                            disabled={item.completed}
                                          >
                                            <Timer className="w-4 h-4 mr-1" />
                                            {activeTimer &&
                                            activeTimer.sectionIndex === sectionIndex &&
                                            activeTimer.itemIndex === itemIndex
                                              ? "Stop"
                                              : "Start"}
                                          </Button>

                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/20"
                                            onClick={() => deleteTopic(sectionIndex, itemIndex)}
                                          >
                                            <Trash className="w-4 h-4" />
                                          </Button>
                                        </CardFooter>
                                      </Card>
                                    ) : null,
                                  )
                                : null}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ) : null,
                    )
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">
                        {searchQuery ? "No topics match your search" : "No roadmap data available"}
                      </p>
                    </div>
                  )}
                </Accordion>
              </TabsContent>

              <TabsContent value="stats">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Progress by Difficulty</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-64">
                        <ChartContainer>
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={difficultyStats}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={2}
                                dataKey="value"
                                label={({ name, value }) => `${name}: ${value}%`}
                                labelLine={false}
                              >
                                {difficultyStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <RechartsTooltip
                                content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    const data = payload[0].payload
                                    return (
                                      <ChartTooltip>
                                        <ChartTooltipContent>
                                          <p className="font-medium">{data.name}</p>
                                          <p className="text-sm text-muted-foreground">
                                            {data.completed} of {data.total} completed ({data.value}%)
                                          </p>
                                        </ChartTooltipContent>
                                      </ChartTooltip>
                                    )
                                  }
                                  return null
                                }}
                              />
                            </PieChart>
                          </ResponsiveContainer>
                        </ChartContainer>
                      </div>
                      <div className="flex flex-col justify-center">
                        <div className="space-y-4">
                          {difficultyStats.map((stat, index) => (
                            <div key={index} className="flex items-center">
                              <div
                                className={`w-3 h-3 rounded-full mr-2`}
                                style={{ backgroundColor: stat.color }}
                              ></div>
                              <div className="flex-1">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm font-medium">{stat.name}</span>
                                  <span className="text-sm text-slate-500 dark:text-slate-400">
                                    {stat.completed}/{stat.total}
                                  </span>
                                </div>
                                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full">
                                  <div
                                    className="h-full rounded-full"
                                    style={{ width: `${stat.value}%`, backgroundColor: stat.color }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <BarChart className="w-5 h-5 mr-2" />
                  <h3 className="text-lg font-medium">Your Stats</h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Overall Completion</p>
                    <p className="text-2xl font-bold">{overallProgress}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Topics Completed</p>
                    <p className="text-2xl font-bold">
                      {roadmapData && Array.isArray(roadmapData)
                        ? roadmapData.reduce(
                            (acc, section) =>
                              acc +
                              (section && section.items
                                ? section.items.filter((item) => item && item.completed).length
                                : 0),
                            0,
                          )
                        : 0}
                      <span className="text-base font-normal text-slate-500 dark:text-slate-400">
                        /
                        {roadmapData && Array.isArray(roadmapData)
                          ? roadmapData.reduce(
                              (acc, section) => acc + (section && section.items ? section.items.length : 0),
                              0,
                            )
                          : 0}
                      </span>
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Estimated Time Remaining</p>
                    <p className="text-2xl font-bold">
                      {(() => {
                        if (!roadmapData || !Array.isArray(roadmapData)) return "0 hours"

                        const remainingHours = roadmapData.reduce((acc, section) => {
                          if (!section || !section.items) return acc

                          return (
                            acc +
                            section.items
                              .filter((item) => item && !item.completed)
                              .reduce((itemAcc, item) => {
                                if (!item || !item.timeEstimate) return itemAcc

                                const timeStr = item.timeEstimate
                                if (timeStr.includes("hour")) {
                                  return itemAcc + Number.parseInt(timeStr) || 0
                                } else if (timeStr.includes("day")) {
                                  return itemAcc + (Number.parseInt(timeStr) || 0) * 8
                                } else if (timeStr.includes("week")) {
                                  return itemAcc + (Number.parseInt(timeStr) || 0) * 40
                                }
                                return itemAcc
                              }, 0)
                          )
                        }, 0)

                        if (remainingHours > 40) {
                          const weeks = Math.floor(remainingHours / 40)
                          const days = Math.floor((remainingHours % 40) / 8)
                          return `${weeks} week${weeks !== 1 ? "s" : ""}${days > 0 ? `, ${days} day${days !== 1 ? "s" : ""}` : ""}`
                        } else if (remainingHours > 8) {
                          const days = Math.floor(remainingHours / 8)
                          const hours = remainingHours % 8
                          return `${days} day${days !== 1 ? "s" : ""}${hours > 0 ? `, ${hours} hour${hours !== 1 ? "s" : ""}` : ""}`
                        }
                        return `${remainingHours} hour${remainingHours !== 1 ? "s" : ""}`
                      })()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total Time Spent</p>
                    <p className="text-2xl font-bold">
                      {formatTime(
                        roadmapData && Array.isArray(roadmapData)
                          ? roadmapData.reduce(
                              (acc, section) =>
                                acc +
                                (section && section.items
                                  ? section.items.reduce(
                                      (itemAcc, item) =>
                                        itemAcc + (item && item.actualTimeSpent ? item.actualTimeSpent : 0),
                                      0,
                                    )
                                  : 0),
                              0,
                            )
                          : 0,
                      )}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <p className="text-sm font-medium mb-2">Next topics to tackle:</p>
                    <ul className="space-y-2">
                      {roadmapData && Array.isArray(roadmapData) ? (
                        roadmapData
                          .flatMap((section) =>
                            section && section.items
                              ? section.items
                                  .filter((item) => item && !item.completed)
                                  .slice(0, 1)
                                  .map((item) => ({ sectionTitle: section.title, ...item }))
                              : [],
                          )
                          .slice(0, 3)
                          .map((item, index) => (
                            <li key={index} className="text-sm">
                              <span className="font-medium">{item.title}</span>
                              <span className="text-slate-500 dark:text-slate-400 block text-xs">
                                {item.sectionTitle} • {item.timeEstimate}
                              </span>
                            </li>
                          ))
                      ) : (
                        <li className="text-sm">No topics available</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}
