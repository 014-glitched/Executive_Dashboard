import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCategories, addWidget, removeWidget, setSearchTerm } from '../redux/WidgetSlice';
import initialData from '../components/data.json';

const Dashboard = () => {
    const dispatch = useDispatch();
    const { categories, searchTerm } = useSelector(state => state.widgets);

    const [newWidget, setNewWidget] = useState({ title: '', content: '' });
    const [showForm, setShowForm] = useState(false);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);
    const [showSlidingDiv, setShowSlidingDiv] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [selectedWidgets, setSelectedWidgets] = useState([]);

    useEffect(() => {
        dispatch(setCategories(initialData.categories));
    }, [dispatch]);

    const handleAddWidgetClick = (categoryIndex = null) => {
        setActiveCategoryIndex(categoryIndex);
        setShowForm(true);
    };

    const WidgetClick = () => {
        setShowSlidingDiv(true);
        if (categories.length > 0) {
            const firstCategory = categories[0];
            setSelectedCategory(firstCategory);
            setSelectedWidgets(firstCategory.widgets);
        }
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setSelectedWidgets(category.widgets);
    };

    const handleWidgetToggle = (widget) => {
        const isSelected = selectedWidgets.find(w => w.title === widget.title);
        if (isSelected) {
            setSelectedWidgets(selectedWidgets.filter(w => w.title !== widget.title));
            dispatch(removeWidget({ categoryName: selectedCategory.name, widgetTitle: widget.title }));
        } else {
            setSelectedWidgets([...selectedWidgets, widget]);
            dispatch(addWidget({ categoryName: selectedCategory.name, widget }));
        }
    };

    const handleConfirm = () => {
        setShowSlidingDiv(false);
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
        if (activeCategoryIndex !== null) {
            const category = categories[activeCategoryIndex];
            dispatch(addWidget({ categoryName: category.name, widget: newWidget }));
        } else {
            alert('Please select a category to add the widget to.');
        }
        setNewWidget({ title: '', content: '' });
        setShowForm(false);
    };

    const handleSearch = (e) => {
        dispatch(setSearchTerm(e.target.value.toLowerCase()));
    };

    const filteredCategories = categories.map(category => ({
        ...category,
        widgets: category.widgets.filter(widget => widget.title.toLowerCase().includes(searchTerm)),
    }));

    return (
        <div className='p-6 bg-blue-100'>
            {/* Dashboard header and search bar */}
            <div className='h-[60px] w-full flex'>
                <div className='h-full w-[20%] flex items-center justify-center sm:text-md md:text-2xl font-bold'>Dashboard</div>
                <div className='h-full w-[50%] flex justify-end items-center'>
                    <input
                        type='text'
                        placeholder='Search for anything.....'
                        className='p-3 h-[60%] rounded-lg w-[70%]'
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                </div>
                <div className='h-full sm"w-[30px] md:w-[30%] flex justify-end items-center'>
                    <button
                        className='p-2 bg-blue-500 text-white rounded-lg'
                        onClick={WidgetClick}
                    >
                        Add Widget
                    </button>
                </div>
            </div>

            {/* Category and widget display */}
            {filteredCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className='mt-6'>
                    <div className='ml-20 text-md'>{category.name}</div>
                    <div className='h-auto p-4 w-full flex justify-center items-center'>
                        <div className='h-[90%] w-[90%] p-5 rounded-lg bg-gray-200 grid lg:grid-cols-3 gap-5 shadow-lg'>
                            {category.widgets.map((widget, widgetIndex) => (
                                <div key={widgetIndex} className='bg-white rounded-lg shadow-lg p-10 relative'>
                                    <div className='text-2xl font-bold text-center'>{widget.title}</div>
                                    <div className='mt-5'>{widget.content}</div>
                                    <button
                                        className='absolute top-2 right-2 bg-red-500 text-white rounded-xl p-2 w-[10%]'
                                        onClick={() => dispatch(removeWidget({ categoryName: category.name, widgetTitle: widget.title }))}
                                    >
                                        X
                                    </button>
                                </div>
                            ))}
                            <div className='bg-gray-100 rounded-lg p-7 flex justify-center shadow-lg items-center'>
                                <button
                                    className='h-[40px] w-[40%] bg-white border-2 shadow-md hover:bg-gray-400 hover:text-white rounded-lg'
                                    onClick={() => handleAddWidgetClick(categoryIndex)}
                                >
                                    Add Widget
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            {/* Add widget form */}
            {showForm && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-10 rounded-lg'>
                        <h2 className='text-xl font-bold mb-4'>Add New Widget</h2>
                        <form onSubmit={handleFormSubmit}>
                            <div className='mb-4'>
                                <label className='block mb-2'>Widget Name</label>
                                <input
                                    type='text'
                                    name='title'
                                    value={newWidget.title}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-lg w-full'
                                    required
                                />
                            </div>
                            <div className='mb-4'>
                                <label className='block mb-2'>Widget Text</label>
                                <textarea
                                    name='content'
                                    value={newWidget.content}
                                    onChange={handleInputChange}
                                    className='p-2 border rounded-lg w-full'
                                    required
                                ></textarea>
                            </div>
                            <div className='flex justify-end'>
                                <button type='submit' className='bg-blue-500 text-white p-2 rounded-lg'>Add Widget</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Sliding div for selecting widgets */}
            {showSlidingDiv && (
                <div className='fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-end'>
                    <div className='bg-white w-1/3 p-10'>
                        <h2 className='text-xl font-bold mb-4'>Select Widgets for {selectedCategory?.name}</h2>
                        <div className=' flex mt-10'>
                        {categories.map((category, index) => (
                            <div key={index} className='mb-4 mr-5 h-[100px]'>
                                <button
                                    className='text-left w-full hover:bg-blue-400 p-2 bg-blue-200 rounded'
                                    onClick={() => handleCategorySelect(category)}
                                >
                                    {category.name}
                                </button>
                            </div>
                        ))}
                        </div>
                        
                        {selectedCategory && (
                            <div className='mt-4'>
                                <h3 className='text-lg  font-bold mb-2'>Widgets in {selectedCategory.name}</h3>
                                {selectedCategory.widgets.map((widget, index) => (
                                    <div key={index} className='mb-2'>
                                        <label>
                                            <input
                                                type='checkbox'
                                                checked={selectedWidgets.some(w => w.title === widget.title)}
                                                onChange={() => handleWidgetToggle(widget)}
                                            />
                                            {widget.title}
                                        </label>
                                    </div>
                                ))}
                                <div className='mt-4 flex justify-end'>
                                    <button className='bg-blue-500 text-white p-2 rounded-lg' onClick={handleConfirm}>Confirm</button>
                                    <button className='bg-gray-500 text-white p-2 rounded-lg ml-4' onClick={handleCancel}>Cancel</button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;

