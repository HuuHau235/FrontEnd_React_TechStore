// InformationOrder.jsx
import { useState, useEffect } from "react";
import "../../../pages/user/Payment/Payment.css";
import LoadingSpinner from "../../../components/common/LoadingSpinner";
import InformationProductDetail from "./InformationProductDetail"; // Import component con

const InformationOrder = ({ onContinue, setCurrentStep }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    province: "",
    provinceName: "",
    district: "",
    districtName: "",
    ward: "",
    wardName: "",
  });

  const [locationData, setLocationData] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetch("https://provinces.open-api.vn/api/?depth=3")
      .then((res) => res.json())
      .then((data) => setLocationData(data))
      .catch((err) => console.error("Error fetching location:", err));
  }, []);

  const handleProvinceChange = (e) => {
    const selectedProvince = locationData.find((p) => String(p.code) === e.target.value);
    if (selectedProvince) {
      setFormData((prev) => ({
        ...prev,
        province: String(selectedProvince.code),
        provinceName: selectedProvince.name,
        district: "",
        districtName: "",
        ward: "",
        wardName: "",
      }));
      setDistricts(selectedProvince.districts);
      setWards([]);
    }
  };

  const handleDistrictChange = (e) => {
    const selectedDistrict = districts.find((d) => String(d.code) === e.target.value);
    if (selectedDistrict) {
      setFormData((prev) => ({
        ...prev,
        district: String(selectedDistrict.code),
        districtName: selectedDistrict.codename,
        ward: "",
        wardName: "",
      }));
      setWards(selectedDistrict.wards || []);
    }
  };

  const handleWardChange = (e) => {
    const selectedWard = wards.find((w) => String(w.code) === e.target.value);
    if (selectedWard) {
      setFormData((prev) => ({
        ...prev,
        ward: String(selectedWard.code),
        wardName: selectedWard.name,
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleContinue = async () => {
    const orderId = localStorage.getItem("currentOrderId");
    if (!orderId) {
      alert("Order has not been created or ID not found");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      alert("Invalid phone number. Please enter exactly 10 digits.");
      return;
    }

    const payload = {
      full_name: formData.fullName,
      phone: formData.phone,
      address: formData.address,
      province: formData.provinceName,
      district: formData.districtName,
      ward: formData.wardName,
    };

    try {
      const response = await fetch(
        `https://backendlaraveltechstore-production.up.railway.app/api/user/orders/${orderId}/update-info`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (response.ok) {
        alert("Recipient information updated successfully!");
        if (typeof onContinue === "function") onContinue();
      } else {
        alert("Update failed: " + result.message);
      }
    } catch (error) {
      console.error("Error while submitting information:", error);
      alert("An error occurred while submitting the information.");
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="payment-container-information-order">
      <h1 className="payment-title-information-order">Payment</h1>
      <div className="payment-content-information-order">
        <div className="left-section-information-order">
          <div className="form-section-information-order">
            <div className="section-header-information-order">
              <div className="step-number-information-order active">1</div>
              <h2>Order Information</h2>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleContinue();
              }}
            >
              <div className="form-content-information-order">
                <div className="form-row-information-order">
                  <div className="form-group-information-order">
                    <label>Full Name</label>
                    <input name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Enter your full name" required />
                  </div>
                  <div className="form-group-information-order">
                    <label>Phone</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter your phone number (10 digits)" required />
                  </div>
                </div>

                <div className="form-group-information-order">
                  <label>Address</label>
                  <input name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your address (street, house number, etc.)" required />
                </div>

                {/* Province / District / Ward */}
                <div className="form-row-information-order">
                  <div className="form-group-information-order">
                    <label>Province</label>
                    <select value={formData.province} onChange={handleProvinceChange} required>
                      <option value="">-- Select Province --</option>
                      {locationData.map((p) => (
                        <option key={p.code} value={String(p.code)}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group-information-order">
                    <label>District</label>
                    <select value={formData.district} onChange={handleDistrictChange} disabled={!formData.province} required>
                      <option value="">-- Select District --</option>
                      {districts.map((d) => (
                        <option key={d.code} value={String(d.code)}>{d.codename}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group-information-order">
                    <label>Ward</label>
                    <select value={formData.ward} onChange={handleWardChange} disabled={!formData.district} required>
                      <option value="">-- Select Ward --</option>
                      {wards.map((w) => (
                        <option key={w.code} value={String(w.code)}>{w.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button type="submit" className="continue-btn-information-order">Continue</button>
              </div>
            </form>
          </div>

          <div className="form-section-information-order" onClick={() => setCurrentStep(2)}>
            <div className="section-header-information-order">
              <div className="step-number-information-order clickable">2</div>
              <h2>Payment Method</h2>
            </div>
          </div>

          <div className="form-section-information-order" onClick={() => setCurrentStep(3)}>
            <div className="section-header-information-order">
              <div className="step-number-information-order clickable">3</div>
              <h2>Order Confirmation</h2>
            </div>
          </div>
        </div>
        <InformationProductDetail />
      </div>
    </div>
  );
};

export default InformationOrder;
