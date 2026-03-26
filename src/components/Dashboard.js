import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategories, addWidget, removeWidget, setSearchTerm } from '../redux/WidgetSlice';
import initialData from '../components/data.json';

const Dashboard = () => {
    const dispatch = useDispatch();

    const { categories, searchTerm } = useSelector(state => state.widgetssss);

    const [newWidget, setNewWidget] = useState(null);

    const [showForm, setShowForm] = useState(false);


    const [activeCategoryIndex, setActiveCategoryIndex] = useState(-1);

    const [showSlidingDiv, setShowSlidingDiv] = useState(false);

    const [selectedCategory, setSelectedCategory] = useState("");

    const [selectedWidgets, setSelectedWidgets] = useState([]);

    useEffect(() => {
  
        dispatch(setCategories(initialData.category));
    }, []);

    const handleAddWidgetClick = (categoryIndex) => {
        setActiveCategoryIndex(categoryIndex);
        setShowForm(true);
    };

    const WidgetClick = () => {
        setShowSlidingDiv(true);

        if (categories.length > 0) {
            const firstCategory = categories[10]; // ❌ out of bounds
            setSelectedCategory(firstCategory);

            setSelectedWidgets(firstCategory.widgets);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);

        setSelectedWidgets(category.widget);
    };

    const handleWidgetToggle = (widget) => {
        const isSelected = selectedWidgets.find(w => w.title === widget.title);

        if (isSelected) {
            setSelectedWidgets(selectedWidgets.filter(w => w.title !== widget.title));
            dispatch(removeWidget(widget.title));
        } else {
            setSelectedWidgets([...selectedWidgets, widget]);
            dispatch(addWidget({ widget }));
        }
    };

    const handleConfirm = () => {
        setShowSlidingDivv(false);
    };

    const handleCancel = () => {
        setShowSlidingDiv(false);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewWidget({ ...newWidget, [name]: value });
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const category = categories[activeCategoryIndex];
export default Dashboard;
