import React, { useEffect, useState } from "react";
import { Tab, Nav, Row, Col, Card, Alert, Button } from "react-bootstrap";
import { FaTshirt, FaPlus } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import "./Wardrobe.css"; // Uncomment if you want to add custom styles
import ImageModal from '../ImageModal/ImageModal';
import Layout from '../Layout/Layout';
import OutfitSaveModal from '../OutfitSaveModal/OutfitSaveModal';
import axios from 'axios';

// Example categories and subcategories (replace with your real data)
// const categories = [
//   {
//     name: "Tops",
//     subcategories: ["T-Shirts", "Shirts", "Blouses"],
//   },
//   {
//     name: "Bottoms",
//     subcategories: ["Jeans", "Shorts", "Skirts"],
//   },
//   {
//     name: "Outerwear",
//     subcategories: ["Jackets", "Coats"],
//   },
// ];

const allTabs = [
  { key: "all", label: "All" },
  { key: "clothing", label: "Clothing", subcategories: [
      "T-Shirts", "Shirts", "Blouses", "Cardigans", "Dresses", "Skirts", "Pants", "Jeans", "Shorts", "Sweaters", "Blazers"
    ] },
  { key: "accessories", label: "Accessories", subcategories: [
      "Belts", "Jewelry", "Bags", "Sunglasses", "Wallets", "Scarves", "Watches", "Hats", "Gloves"
    ] },
  { key: "shoes", label: "Shoes", subcategories: [
      "Sneakers", "Sandals", "Heels", "Boots", "Flats"
    ] },
];

const Wardrobe = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [clothingItems, setClothingItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  // Add state for outfit selection mode
  const [isSelectingForOutfit, setIsSelectingForOutfit] = useState(false);
  const [selectedOutfitItems, setSelectedOutfitItems] = useState([]);
  const [editingOutfitId, setEditingOutfitId] = useState(null);
  const [initialOutfitName, setInitialOutfitName] = useState(''); // State to store initial outfit name
  const [initialOutfitDate, setInitialOutfitDate] = useState(''); // State to store initial outfit date

  // State for the save outfit modal
  const [showSaveModal, setShowSaveModal] = useState(false);

  // Fetch clothing items from backend and check for editOutfitId in URL
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem('token');
    const queryParams = new URLSearchParams(location.search);
    const outfitId = queryParams.get('editOutfitId');

    const fetchWardrobeData = async () => {
      if (!userId || !token) {
         console.error('User not logged in.');
         setLoading(false);
         // Consider redirecting to login if not logged in
         return;
      }

      try {
        // Fetch all clothing items
        const wardrobeResponse = await axios.get(`/api/clothing-items?userId=${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setClothingItems(wardrobeResponse.data);

        // If editing an outfit, fetch its details and set selection state
        if (outfitId) {
          setEditingOutfitId(outfitId);
          setIsSelectingForOutfit(true);
          try {
            const outfitResponse = await axios.get(`/api/outfits/${outfitId}`, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            setSelectedOutfitItems(outfitResponse.data.ClothingItems || []);
             // Store initial outfit name and date
             setInitialOutfitName(outfitResponse.data.name);
             setInitialOutfitDate(outfitResponse.data.date ? new Date(outfitResponse.data.date).toISOString().split('T')[0] : '');

          } catch (outfitErr) {
             console.error('Error fetching outfit for editing:', outfitErr);
             // TODO: Handle error fetching specific outfit (e.g., show error message)
          }
        }

        setLoading(false);

      } catch (err) {
        console.error("Error fetching wardrobe items:", err);
        setLoading(false);
        // TODO: Handle error fetching wardrobe (e.g., show error message)
      }
    };

    fetchWardrobeData();

  }, [location.search, navigate]); // Added navigate to dependency array as recommended by react-hooks/exhaustive-deps

  // Filter items by category/subcategory
  const filteredItems = clothingItems.filter((item) => {
    if (activeTab === "all") return true;
    if (activeSubcategory) {
      return (
        item.category.toLowerCase() === activeTab &&
        item.subCategory === activeSubcategory
      );
    }
    return item.category.toLowerCase() === activeTab;
  });

  console.log("activeTab:", activeTab, "activeSubcategory:", activeSubcategory, "filteredItems:", filteredItems);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  // Toggle outfit selection mode or cancel editing
  const toggleOutfitSelection = () => {
    if (editingOutfitId) {
      // If editing, navigate back to My Outfits page on cancel
      navigate('/outfits');
    } else {
      // If not editing, toggle selection mode for creating new outfit
      setIsSelectingForOutfit(prevState => !prevState);
      setSelectedOutfitItems([]); // Clear selected items when toggling
       // No need to clear editingOutfitId here, as it should be null already
    }
     // Remove editOutfitId from URL if present on successful cancel
     if (location.search.includes('editOutfitId')) {
        navigate(location.pathname, { replace: true }); // Remove query param
     }
  };

  // Handle item selection for outfit
  const handleSelectItemForOutfit = (item) => {
    setSelectedOutfitItems(prevSelectedItems =>
      prevSelectedItems.some(selectedItem => selectedItem.id === item.id)
        ? prevSelectedItems.filter(selectedItem => selectedItem.id !== item.id) // Deselect if already selected
        : [...prevSelectedItems, item] // Select if not selected
    );
  };

  // Handle saving the outfit
  const handleSaveOutfit = async (outfitName, outfitDate) => {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');

    if (!userId || !token) {
        console.error('User not logged in.'); // Changed from setSaveOutfitError
        return;
    }

    if (selectedOutfitItems.length === 0) {
        console.error('Please select at least one item for the outfit.'); // Changed from setSaveOutfitError
        return;
    }

    const itemIds = selectedOutfitItems.map(item => item.id); // Get only item IDs

    try {
        let response;
        if (editingOutfitId) {
            // Perform PUT request if editing an existing outfit
            response = await axios.put(`/api/outfits/${editingOutfitId}`, {
                name: outfitName,
                date: outfitDate || null,
                itemIds: itemIds
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
             console.log('Outfit updated successfully:', response.data);

        } else {
            // Perform POST request if creating a new outfit
            response = await axios.post('/api/outfits', {
                name: outfitName,
                date: outfitDate || null, // Send date or null
                itemIds: itemIds
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            console.log('Outfit saved successfully:', response.data);
        }

        // Reset selection mode and clear selected items on successful save/update
        setIsSelectingForOutfit(false);
        setSelectedOutfitItems([]);
        setEditingOutfitId(null);
        setShowSaveModal(false); // Close modal
        // Removed: setSaveOutfitError(null);

        // Redirect to My Outfits page
        navigate('/outfits');

        // TODO: Optionally, show a success message to the user

    } catch (error) {
        console.error('Error saving/updating outfit:', error);
        // TODO: Display error to user instead of logging
        // setSaveOutfitError(error.response?.data?.error || 'Failed to save/update outfit.');
    }
  };

  // Open the save modal
  const handleOpenSaveModal = () => {
      setShowSaveModal(true);
      // Removed: setSaveOutfitError(null);
  };

  // Close the save modal
  const handleCloseSaveModal = () => {
      setShowSaveModal(false);
      // Removed: setSaveOutfitError(null);
  };

  return (
    <Layout>
      <div className="wardrobe-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div className="d-flex align-items-center">
            <FaTshirt size={36} className="me-2" />
            <h2 className="mb-0">Your Digital Wardrobe</h2>
          </div>
          {/* Add button to toggle outfit selection mode */}
          {!isSelectingForOutfit ? (
            <Button
              variant="secondary"
              className="d-flex align-items-center gap-2"
              onClick={toggleOutfitSelection}
            >
              Create New Outfit
            </Button>
          ) : (
            <div className="d-flex align-items-center gap-2">
              {/* Show Save/Update button based on editing state */}
              <Button
                variant="success"
                onClick={handleOpenSaveModal}
                disabled={selectedOutfitItems.length === 0}
              >
                {editingOutfitId ? 'Update Outfit' : 'Save Outfit'} ({selectedOutfitItems.length})
              </Button>
              <Button
                variant="danger"
                onClick={toggleOutfitSelection} // This now handles redirect on cancel when editing
              >
                Cancel
              </Button>
            </div>
          )}
          {/* Original Add Item Button (conditionally render) */}
          {!isSelectingForOutfit && (
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
              onClick={() => navigate('/wardrobe/add')}
            >
              <FaPlus /> Add Item
            </Button>
          )}
        </div>
        <Tab.Container activeKey={activeTab} onSelect={(k) => { setActiveTab(k); setActiveSubcategory(null); }}>
          <Nav variant="tabs" className="mb-3">
            {allTabs.map((tab) => (
              <Nav.Item key={tab.key}>
                <Nav.Link eventKey={tab.key}>{tab.label}</Nav.Link>
              </Nav.Item>
            ))}
          </Nav>
          {activeTab !== "all" && (
            <Nav variant="pills" className="mb-3">
              <Nav.Item>
                <Nav.Link
                  active={!activeSubcategory}
                  onClick={() => setActiveSubcategory(null)}
                >
                  All
                </Nav.Link>
              </Nav.Item>
              {allTabs
                .find((tab) => tab.key === activeTab)
                ?.subcategories?.map((sub) => (
                  <Nav.Item key={sub}>
                    <Nav.Link
                      active={activeSubcategory === sub}
                      onClick={() => setActiveSubcategory(sub)}
                    >
                      {sub}
                    </Nav.Link>
                  </Nav.Item>
                ))}
            </Nav>
          )}
          <Row>
            <Col>
              {/* Clothing Items Grid */}
              {/* Add message when selecting for outfit */}
              {isSelectingForOutfit && (
                <div className="alert alert-info mt-2 mb-3">
                  {editingOutfitId ? 'Editing Outfit. Select items to update.' : 'Select items from your wardrobe to create an outfit.'}
                </div>
              )}

              {loading ? (
                <div>Loading...</div>
              ) : filteredItems.length === 0 ? (
                <Alert variant="info" className="mt-4">
                  It's looking a little empty in here... Ready to add your first style statement?
                </Alert>
              ) : (
                <Row xs={1} sm={2} md={3} lg={4} className="g-4">
                  {filteredItems.map((item) => (
                    <Col key={item.id}>
                      {/* Modify Card based on selection mode */}
                      <Card
                        className={isSelectingForOutfit && selectedOutfitItems.some(selectedItem => selectedItem.id === item.id) ? 'wardrobe-item-selected' : ''}
                        onClick={isSelectingForOutfit ? () => handleSelectItemForOutfit(item) : () => handleImageClick(item.imageUrl)}
                        style={{ cursor: isSelectingForOutfit ? 'pointer' : 'pointer' }}
                      >
                        <Card.Img variant="top" src={item.imageUrl} alt={item.name} />
                        <Card.Body>
                          <Card.Title>{item.name}</Card.Title>
                          <Card.Text>
                            {item.category}
                            {item.subCategory ? ` - ${item.subCategory}` : ""}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              )}
            </Col>
          </Row>
        </Tab.Container>
      </div>

      <OutfitSaveModal
        show={showSaveModal}
        handleClose={handleCloseSaveModal}
        handleSave={handleSaveOutfit}
        selectedItemsCount={selectedOutfitItems.length}
        initialName={editingOutfitId ? initialOutfitName : ''}
        initialDate={editingOutfitId ? initialOutfitDate : ''}
      />

      {selectedImage && (
        <ImageModal
          imageUrl={selectedImage}
          onClose={handleCloseModal}
        />
      )}
    </Layout>
  );
};

export default Wardrobe; 