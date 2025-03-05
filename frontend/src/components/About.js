import React, { useState } from "react";
import "./About.css";
import img1 from "../assets/analysis1.jpeg";
import img2 from "../assets/analysis2.jpeg";
import img3 from "../assets/analysis3.jpeg";
import img4 from "../assets/analysis4.jpeg";
import img5 from "../assets/analysis5.jpeg";
import model1 from "../assets/model1.jpeg";
import model2 from "../assets/model2.jpeg";
import model3 from "../assets/model3.jpeg";
// import model4 from "../assets/model4.jpeg";

const AboutSection = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const analysisData = [
    { img: img1, text: "Readmission rates vary across insurance types, having higher patient counts but lower readmission proportions. " },
    { img: img2, text: "The chart shows a gender distribution with males (1) representing 55.9% and females (0) representing 44.1% of the population." },
    { img: img3, text: "Monthly admissions fluctuate, with a notable dip in month 2 and peaks in months 3 and 7, showing overall variability in patient intake." },
    { img: img4, text: "Admissions by Type show a significant concentration in Type 1, with a notable gender disparity favoring gender 0.  Types 0 and 2 also exhibit admissions, though at much lower counts." },
    { img: img5, text: "The heatmap reveals correlations between medical factors, showing a strong positive link between the severity and mortality of diagnosis-related groups (DRGs).  Additionally, DRG severity correlates moderately with length of stay, while discharge location and insurance exhibit a negative correlation." },
  ];

  const modelData = [
    { img: model1, text: "This matrix evaluates our model's classification accuracy.  It shows where predictions match reality (true positives/negatives) and where they don't (false positives/negatives). We're focusing on reducing misclassifications, particularly for class 1." },
    { img: model2, text: "Our model excels at predicting class 0 with high precision and recall, but struggles with class 1, showing lower precision. Overall accuracy is 86%, but the macro average F1-score highlights the imbalance in performance between the two classes." },
    { img: model3, text: "The graph highlights the most influential features in our model, with 'icd9_code_y' and 'seq_num' showing the highest importance scores. 'drg_type', 'gender', and 'insurance' have the least impact on the model's predictions." },
    // { img: model4, text: "Model 4 - Logistic Regression for probability-based prediction." },
  ];

  return (
    <section className="about-section">
      <h2>Heart Failure Analysis</h2>
      <div className="analysis-container">
        {analysisData.map((item, index) => (
          <div key={index} className="analysis-box">
            <img 
              src={item.img} 
              alt={`Analysis ${index + 1}`} 
              onClick={() => setSelectedImage(item.img)}
              className="clickable-image"
            />
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Model Analysis Section */}
      <h2>Model Analysis</h2>
      <div className="model-analysis-container">
        {modelData.map((item, index) => (
          <div key={index} className="model-analysis-box">
            <img 
              src={item.img} 
              alt={`Model ${index + 1}`} 
              onClick={() => setSelectedImage(item.img)}
              className="model-img"
            />
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      {/* Enlarged Image View */}
      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>
          <img src={selectedImage} alt="Enlarged View" className="enlarged-image" />
          <button className="close-btn" onClick={() => setSelectedImage(null)}>✖</button>
        </div>
      )}
    </section>
  );
};

export default AboutSection;
