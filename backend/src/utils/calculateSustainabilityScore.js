const calculateSustainabilityScore = (sustainability) => {

    let score = 0;

    if (sustainability.recyclableMaterial) score += 10;
    if (sustainability.biodegradable) score += 10;
    if (sustainability.plasticFree) score += 10;
    if (sustainability.crueltyFree) score += 10;
    if (sustainability.fairTradeCertified) score += 10;
    if (sustainability.renewableEnergyUsed) score += 10;

    let carbonScore = (1 - (sustainability.carbonFootprint / 20)) * 20;
    score += carbonScore;

    let efficiencyScore = (sustainability.energyEfficiencyRating / 5) * 20;
    score += efficiencyScore;
    
    return score;
}

export default calculateSustainabilityScore;