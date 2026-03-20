import { useState } from "react";
import { addProduct } from "../../services/productServices";

export default function AddProductForm() {
  // without using multiple useStates for each and every input use one
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "",
    description: "",
    recyclableMaterial: true,
    biodegradable: true,
    plasticFree: true,
    carbonFootprint: 0,
    crueltyFree: true,
    fairTradeCertified: true,
    renewableEnergyUsed: true,
    energyEfficiencyRating: 0,
  });

  // store for data in formData object
  const handleFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  console.log("form data ", formData);

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page reload

    try {
      const response = await addProduct(formData);
      console.log("Success:", response);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Product Name :
        <input type="text" name="name" onChange={(e) => handleFormData(e)} />
      </label>
      <br></br>

      <label>
        Product Brand :
        <input type="text" name="brand" onChange={(e) => handleFormData(e)} />
      </label>
      <br></br>

      <label>
        Product Category :
        <input
          type="text"
          name="category"
          onChange={(e) => handleFormData(e)}
        />
      </label>
      <br></br>

      <label>
        Product Description :
        <input
          type="text"
          name="description"
          onChange={(e) => handleFormData(e)}
        />
      </label>
      <br></br>

      <label>
        Product Images :
        <input type="file" />
      </label>
      <br></br>

      <label>Is recyclable material?</label>
      <br />

      <label>
        <input
          type="radio"
          name="recyclableMaterial"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="recyclableMaterial"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>Is biodegradable?</label>
      <br />

      <label>
        <input
          type="radio"
          name="biodegradable"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="biodegradable"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>Is plastic free?</label>
      <br />

      <label>
        <input
          type="radio"
          name="plasticFree"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="plasticFree"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>
        carbon footprint value?
        <input
          type="number"
          name="carbonFootprint"
          onChange={(e) => handleFormData(e)}
        />
      </label>
      <br />

      <label>Is cruelty free?</label>
      <br />

      <label>
        <input
          type="radio"
          name="crueltyFree"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="crueltyFree"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>Is fair trade certified?</label>
      <br />

      <label>
        <input
          type="radio"
          name="fairTradeCertified"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="fairTradeCertified"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>Is renewable energy used?</label>
      <br />

      <label>
        <input
          type="radio"
          name="renewableEnergyUsed"
          value={true}
          onChange={(e) => handleFormData(e)}
        />
        Yes
      </label>

      <label>
        <input
          type="radio"
          name="renewableEnergyUsed"
          value={false}
          onChange={(e) => handleFormData(e)}
        />
        No
      </label>
      <br />

      <label>
        Energy efficiency value?
        <input
          type="number"
          name="energyEfficiencyRating"
          onChange={(e) => handleFormData(e)}
        />
      </label>
      <br />

      <button type="submit">Add Product</button>
      
    </form>
  );
}
