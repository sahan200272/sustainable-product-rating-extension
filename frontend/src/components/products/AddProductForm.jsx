import { useState } from "react";
import { addProduct } from "../../services/productServices";

export default function AddProductForm() {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    image: null,
    sustainability: {
        recyclableMaterial: true,
        biodegradable: true,
        plasticFree: true,
        carbonFootprint: 0,
        crueltyFree: true,
        fairTradeCertified: true,
        renewableEnergyUsed: true,
        energyEfficiencyRating: 0,
    },
  });

  // FIXED handler
  const handleFormData = (e) => {
  const { name, value, type, files } = e.target;

  // fields inside sustainability
  const sustainabilityFields = [
    "recyclableMaterial",
    "biodegradable",
    "plasticFree",
    "carbonFootprint",
    "crueltyFree",
    "fairTradeCertified",
    "renewableEnergyUsed",
    "energyEfficiencyRating",
  ];

  // convert values
  let finalValue =
    type === "file"
      ? files[0]
      : type === "radio"
      ? value === "true"
      : type === "number"
      ? Number(value)
      : value;

  // ✅ if field belongs to sustainability
  if (sustainabilityFields.includes(name)) {
    setFormData({
      ...formData,
      sustainability: {
        ...formData.sustainability,
        [name]: finalValue,
      },
    });
  } else {
    // normal fields
    setFormData({
      ...formData,
      [name]: finalValue,
    });
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Sending data:", formData);

      const response = await addProduct(formData);
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Name :
        <input type="text" name="name" onChange={handleFormData} />
      </label>
      <br />

      <label>
        Product Brand :
        <input type="text" name="brand" onChange={handleFormData} />
      </label>
      <br />

      <label>
        Product Category :
        <input type="text" name="category" onChange={handleFormData} />
      </label>
      <br />

      <label>
        Product Description :
        <input type="text" name="description" onChange={handleFormData} />
      </label>
      <br />

      <label>
        Product Image :
        <input type="file" name="image" onChange={handleFormData} />
      </label>
      <br />

      {/* ✅ Recyclable */}
      <label>Is recyclable material?</label><br />
      <input type="radio" name="recyclableMaterial" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="recyclableMaterial" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Biodegradable */}
      <label>Is biodegradable?</label><br />
      <input type="radio" name="biodegradable" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="biodegradable" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Plastic Free */}
      <label>Is plastic free?</label><br />
      <input type="radio" name="plasticFree" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="plasticFree" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Carbon */}
      <label>
        Carbon footprint:
        <input type="number" name="carbonFootprint" onChange={handleFormData} />
      </label>
      <br />

      {/* ✅ Cruelty Free */}
      <label>Is cruelty free?</label><br />
      <input type="radio" name="crueltyFree" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="crueltyFree" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Fair Trade */}
      <label>Is fair trade certified?</label><br />
      <input type="radio" name="fairTradeCertified" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="fairTradeCertified" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Renewable */}
      <label>Is renewable energy used?</label><br />
      <input type="radio" name="renewableEnergyUsed" value="true" onChange={handleFormData} /> Yes
      <input type="radio" name="renewableEnergyUsed" value="false" onChange={handleFormData} /> No
      <br />

      {/* ✅ Energy */}
      <label>
        Energy efficiency:
        <input type="number" name="energyEfficiencyRating" onChange={handleFormData} />
      </label>
      <br />

      <button type="submit">Add Product</button>
    </form>
  );
}