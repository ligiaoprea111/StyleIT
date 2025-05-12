import React, { useEffect, useState } from "react";
import { Container, Tab, Nav, Row, Col, Card, Alert } from "react-bootstrap";
import { FaTshirt } from "react-icons/fa";
import "./Wardrobe.css"; // Uncomment if you want to add custom styles

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
  const [clothingItems, setClothingItems] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch clothing items from backend (replace with your API call)
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    fetch(`/api/clothing-items?userId=${userId}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched clothing items:", data);
        console.log("All categories in data:", data.map(i => i.category));
        setClothingItems(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching clothing items:", err);
        setLoading(false);
      });
  }, []);

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

  return (
    <>
      <Container className="mt-4">
        <div className="d-flex align-items-center mb-4">
          <FaTshirt size={36} className="me-2" />
          <h2 className="mb-0"> Your Digital Wardrobe</h2>
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
                      <Card>
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
      </Container>
    </>
  );
};

export default Wardrobe; 