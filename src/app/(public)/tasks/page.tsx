"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, FileText, CheckSquare, Trash, Archive, Eye, EyeOff, RefreshCw, Calendar } from 'lucide-react';

const NoteTakingApp = () => {
    const [notes, setNotes] = useState<any>([]);
    const [selectedNote, setSelectedNote] = useState<any>(null);
    const [content, setContent] = useState('');
    const [tasks, setTasks] = useState<any>([]);
    const [newTask, setNewTask] = useState('');
    const [showAllTasks, setShowAllTasks] = useState(false);
    const [showCompletedTasks, setShowCompletedTasks] = useState(false);
    const [showDraftTasks, setShowDraftTasks] = useState(false);
    const [lastSaved, setLastSaved] = useState<any>(null);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        const item = typeof window !== 'undefined' ? localStorage.getItem('notes') : null;
        const savedNotes: any = item ? JSON.parse(item) : [];
        setNotes(savedNotes);
    }, []);

    const saveToLocalStorage = useCallback(() => {
        localStorage.setItem('notes', JSON.stringify(notes));
        setLastSaved(new Date());
        setIsUpdating(true);
        setTimeout(() => setIsUpdating(false), 1000);
    }, [notes]);

    useEffect(() => {
        let timeout;
        if (selectedNote) {
            const updatedNotes: any = notes.map((note: any) =>
                note.id === selectedNote.id ? { ...note, content, tasks } : note
            );
            timeout = setTimeout(() => {
                setNotes(updatedNotes);
                saveToLocalStorage();
            }, 1000);
        }
        return () => clearTimeout(timeout);
    }, [content, tasks, selectedNote, notes, saveToLocalStorage]);

    const addNote = () => {
        const newNote: any = { id: Date.now(), title: 'ملاحظة جديدة', content: '', tasks: [] };
        setNotes([...notes, newNote]);
        setSelectedNote(newNote);
        setContent('');
        setTasks([]);
    };

    const addTask = () => {
        if (newTask.trim() !== '') {
            const newTaskItem = {
                id: Date.now(),
                text: newTask,
                completed: false,
                isDraft: false,
                createdAt: new Date().toLocaleString(),
                dueDate: null
            };
            setTasks([...tasks, newTaskItem]);
            setNewTask('');
        }
    };

    const toggleTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, completed: !task.completed, completedAt: task.completed ? null : new Date().toLocaleString() } : task
        ));
    };

    const deleteTask = (taskId) => {
        setTasks(tasks.filter(task => task.id !== taskId));
    };

    const toggleDraftTask = (taskId) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, isDraft: !task.isDraft } : task
        ));
    };

    const setTaskDueDate = (taskId, dueDate) => {
        setTasks(tasks.map(task =>
            task.id === taskId ? { ...task, dueDate } : task
        ));
    };

    const allTasks = notes.flatMap(note => note.tasks);

    const filteredTasks = allTasks.filter(task =>
        (showCompletedTasks || !task.completed) &&
        (showDraftTasks || !task.isDraft)
    );

    return (
        <div dir="rtl" className="h-screen flex flex-col">
            <header className="bg-blue-500 text-white p-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold">تطبيق تدوين الملاحظات</h1>
                <div className="flex items-center">
                    {isUpdating && <RefreshCw className="animate-spin mr-2 h-5 w-5" />}
                    {lastSaved && (
                        <span className="text-sm">
                            آخر تحديث: {lastSaved.toLocaleTimeString()}
                        </span>
                    )}
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <div className="w-64 bg-gray-100 p-4 overflow-y-auto">
                    <button onClick={addNote} className="w-full mb-4 bg-blue-500 text-white p-2 rounded">
                        <Plus className="inline-block ml-2 h-4 w-4" /> إضافة ملاحظة
                    </button>
                    <ul>
                        {notes.map(note => (
                            <li
                                key={note.id}
                                onClick={() => {
                                    setSelectedNote(note);
                                    setContent(note.content);
                                    setTasks(note.tasks);
                                    setShowAllTasks(false);
                                }}
                                className="cursor-pointer p-2 hover:bg-gray-200 flex items-center"
                            >
                                <FileText className="inline-block ml-2 h-4 w-4" />
                                {note.title}
                            </li>
                        ))}
                    </ul>
                    <button
                        onClick={() => setShowAllTasks(true)}
                        className="w-full mt-4 bg-green-500 text-white p-2 rounded flex items-center justify-center"
                    >
                        <CheckSquare className="inline-block ml-2 h-4 w-4" />
                        عرض جميع المهام
                    </button>
                </div>
                <div className="flex-1 p-4 overflow-y-auto">
                    {showAllTasks ? (
                        <div>
                            <h2 className="text-xl font-semibold mb-4">جميع المهام</h2>
                            <div className="mb-4 flex space-x-4">
                                <button
                                    onClick={() => setShowCompletedTasks(!showCompletedTasks)}
                                    className="flex items-center bg-blue-100 text-blue-800 p-2 rounded"
                                >
                                    {showCompletedTasks ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
                                    {showCompletedTasks ? 'إخفاء المهام المكتملة' : 'إظهار المهام المكتملة'}
                                </button>
                                <button
                                    onClick={() => setShowDraftTasks(!showDraftTasks)}
                                    className="flex items-center bg-blue-100 text-blue-800 p-2 rounded"
                                >
                                    {showDraftTasks ? <EyeOff className="ml-2 h-4 w-4" /> : <Eye className="ml-2 h-4 w-4" />}
                                    {showDraftTasks ? 'إخفاء المسودات' : 'إظهار المسودات'}
                                </button>
                            </div>
                            <ul>
                                {filteredTasks.map(task => (
                                    <li key={task.id} className="flex items-center mb-2">
                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            className="ml-2"
                                        />
                                        <span className={`${task.completed ? 'line-through' : ''} ${task.isDraft ? 'text-gray-500 italic' : ''}`}>
                                            {task.text}
                                            <span className="text-xs text-gray-500 ml-2">({task.createdAt})</span>
                                            {task.completedAt && <span className="text-xs text-green-500 ml-2">(تم الإنجاز: {task.completedAt})</span>}
                                            {task.dueDate && <span className="text-xs text-red-500 ml-2">(موعد الانتهاء: {task.dueDate})</span>}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : selectedNote ? (
                        <>
                            <input
                                type="text"
                                value={selectedNote?.title}
                                onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
                                className="w-full mb-4 p-2 text-xl font-bold border-b"
                                placeholder="عنوان الملاحظة"
                            />
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-64 mb-4 p-2 border rounded"
                                placeholder="اكتب ملاحظتك هنا..."
                            />
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold mb-2">المهام</h3>
                                <div className="flex mb-2">
                                    <input
                                        type="text"
                                        value={newTask}
                                        onChange={(e) => setNewTask(e.target.value)}
                                        placeholder="أضف مهمة جديدة"
                                        className="flex-1 ml-2 p-2 border rounded"
                                    />
                                    <button onClick={addTask} className="bg-green-500 text-white p-2 rounded">إضافة</button>
                                </div>
                                <ul>
                                    {tasks.map((task: any) => (
                                        <li key={task.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                                className="ml-2"
                                            />
                                            <span className={`flex-grow ${task.completed ? 'line-through' : ''} ${task.isDraft ? 'text-gray-500 italic' : ''}`}>
                                                {task.text}
                                                <span className="text-xs text-gray-500 ml-2">({task.createdAt})</span>
                                                {task.completedAt && <span className="text-xs text-green-500 ml-2">(تم الإنجاز: {task.completedAt})</span>}
                                            </span>
                                            <input
                                                type="date"
                                                value={task.dueDate || ''}
                                                onChange={(e) => setTaskDueDate(task.id, e.target.value)}
                                                className="ml-2 p-1 border rounded"
                                            />
                                            <button onClick={() => toggleDraftTask(task.id)} className="ml-2 text-blue-500">
                                                <Archive className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => deleteTask(task.id)} className="ml-2 text-red-500">
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </>
                    ) : (
                        <p>الرجاء اختيار ملاحظة أو إضافة ملاحظة جديدة.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NoteTakingApp;