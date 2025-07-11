export const STATISTICS_1_CONTENT = `
# Statistics 1  

## 1. Mathematical Models in Probability and Statistics
### 1.1 Statistical Modeling
- Purpose:
- To represent real-world situations mathematically
- To make predictions based on data
- To test hypotheses about populations
- Process:
- Identify the problem or question
- Collect relevant data
- Choose an appropriate statistical model
- Analyze the data using the model
- Interpret results and draw conclusions
- Refine the model if necessary
- Examples:
- Probability distributions for random phenomena
- Regression models for relationships between variables
- Hypothesis tests for making decisions based on data
## 2. Representation and Summary of Data
### 2.1 Graphical Representations
- Histograms:
- Used for continuous data
- Rectangles represent frequency within class intervals
- Area of each rectangle proportional to frequency
- Vertical axis can show frequency, relative frequency, or frequency density
- Stem and Leaf Diagrams:
- Displays both the distribution shape and the actual data values
- Stem: Leading digit(s)
- Leaf: Final digit
- Back-to-back diagrams compare two distributions
- Box Plots:
- Box shows interquartile range (IQR) with median marked
- Whiskers extend to minimum and maximum values, or to 1.5×IQR
- Shows median, quartiles, range, and potential outliers
- Multiple box plots allow for easy comparison of distributions
### 2.2 Measures of Location
- Mean:
- Sum of values divided by number of values
- x̄ = Σx/n for ungrouped data
- x̄ = Σfx/Σf for grouped data
- Influenced by extreme values (not resistant)
- Median:
- Middle value when data is arranged in order
- For n values: (n+1)/2 position if n is odd; average of n/2 and (n/2)+1 positions if n is even
- More resistant to outliers than the mean
- Mode:
- Most frequently occurring value(s)
- Can have multiple modes (bimodal, multimodal)
- For grouped data, modal class has highest frequency
- Data Coding:
- Transformation of data to simplify calculations
- y = (x - a)/b where a and b are constants
- Effect on mean: ȳ = (x̄ - a)/b
- No effect on shape of distribution
### 2.3 Measures of Dispersion
- Range:
- Difference between maximum and minimum values
- Simple but affected by outliers
- Interquartile Range (IQR):
- Difference between upper and lower quartiles: Q₃ - Q₁
- Covers the middle 50% of data
- More resistant to outliers than range
- Variance:
- Average of squared deviations from the mean
- σ² = Σ(x - x̄)²/n for a population
- s² = Σ(x - x̄)²/(n-1) for a sample
- Units are square of original data units
- Standard Deviation:
- Square root of variance
- σ or s
- Same units as original data
- Measures average distance from the mean
- Interpercentile Ranges:
- Difference between specific percentiles
- Examples: 10-90 percentile range, 5-95 percentile range
- Used to exclude extreme values
### 2.4 Skewness and Outliers
- Skewness:
- Measure of asymmetry in a distribution
- Positive (right) skew: Mean > Median, long tail to the right
- Negative (left) skew: Mean < Median, long tail to the left
- Symmetric: Mean ≈ Median
- Outliers:
- Values that differ significantly from other observations
- Can be identified using box plots
- Common rule: Value is an outlier if it's more than 1.5×IQR below Q₁ or above Q₃
- Should be investigated to determine if they represent errors or important phenomena
## 3. Probability
### 3.1 Elementary Probability
- Basic Definition:
- Probability of event A = P(A) = Number of favorable outcomes / Total number of possible outcomes
- 0 ≤ P(A) ≤ 1
- P(certain event) = 1
- P(impossible event) = 0
- Rules:
- P(not A) = 1 - P(A)
- P(A or B) = P(A) + P(B) - P(A and B)
- For mutually exclusive events: P(A or B) = P(A) + P(B)
3.2 Sample Space and Events
- Sample Space:
- Set of all possible outcomes of an experiment
- Denoted by S or Ω
- Event:
- A subset of the sample space
- Collection of outcomes
- Types of Events:
- Exclusive (mutually exclusive): Cannot occur simultaneously (A ∩ B = ∅)
- Complementary: A' or Ā contains all outcomes not in A, and A ∪ A' = S
- Conditional: Probability of an event given that another event has occurred
- Conditional Probability:
- P(A|B) = P(A ∩ B) / P(B)
- Probability of A given that B has occurred
### 3.3 Independence
- Independent Events:
- Occurrence of one event does not affect the probability of the other
- P(A|B) = P(A) and P(B|A) = P(B)
- P(A ∩ B) = P(A) × P(B)
- Testing Independence:
- Check if P(A ∩ B) = P(A) × P(B)
- Check if P(A|B) = P(A)
- Applications:
- Multiple trials of the same experiment
- Events from different experiments
- Selecting items with replacement
### 3.4 Probability Laws
- Sum Law:
- P(A ∪ B) = P(A) + P(B) - P(A ∩ B)
- For n events: P(A₁ ∪ A₂ ∪ ... ∪ Aₙ) = ΣP(Aᵢ) - ΣP(Aᵢ ∩ Aⱼ) + ΣP(Aᵢ ∩ Aⱼ ∩ Aₖ) - ... + (-1)ⁿ⁺¹P(A₁ ∩ A₂ ∩ ... ∩ Aₙ)
- Product Law:
- P(A ∩ B) = P(A) × P(B|A) = P(B) × P(A|B)
- For n events: P(A₁ ∩ A₂ ∩ ... ∩ Aₙ) = P(A₁) × P(A₂|A₁) × P(A₃|A₁ ∩ A₂) × ... × P(Aₙ|A₁ ∩ A₂ ∩ ... ∩ Aₙ₋₁)
- Tools:
- Tree diagrams for sequential events
- Venn diagrams for set relationships
- Tables for two-way classifications
- Sampling:
- With replacement: Independent selections
- Without replacement: Dependent selections
- Probability changes after each selection if without replacement
## 4. Correlation and Regression
### 4.1 Scatter Diagrams and Linear Regression
- Scatter Diagram:
- Graphical representation of bivariate data
- Each point represents a pair of values (x, y)
- Reveals patterns, trends, and possible relationships
- Linear Relationship:
- When points approximately follow a straight line
- Positive: y tends to increase as x increases
- Negative: y tends to decrease as x increases
- Strength indicated by how closely points cluster around the line
- Regression Line:
- Line of best fit through data points
- Minimizes the sum of squared vertical distances from points to line
- Equation: y = a + bx
- Least squares method gives b = Σ[(x - x̄)(y - ȳ)] / Σ[(x - x̄)²] and a = ȳ - bx̄
### 4.2 Explanatory and Response Variables
- Definitions:
- Explanatory (independent) variable: Typically plotted on x-axis
- Response (dependent) variable: Typically plotted on y-axis
- Relationship: Changes in explanatory variable may cause or be associated with changes in response variable
- Applications:
- Prediction: Using the regression line to estimate y for a given x value
- Interpolation: Predictions within the range of observed x values
- Extrapolation: Predictions outside the range of observed x values (potentially unreliable)
- Variable Transformation:
- Linear change of variable: y = ax + b
- Logarithmic transformation: ln(y) = a + b ln(x) for power relationships
- Used to linearize non-linear relationships
### 4.3 Correlation Coefficient
- Product Moment Correlation Coefficient:
- Measures strength and direction of linear relationship
- Formula: r = Σ[(x - x̄)(y - ȳ)] / √[Σ(x - x̄)² × Σ(y - ȳ)²]
- Range: -1 ≤ r ≤ 1
- Interpretation:
- r ≈ 1: Strong positive correlation
- r ≈ -1: Strong negative correlation
- r ≈ 0: Little or no linear correlation
- |r| > 0.8: Strong correlation
- 0.5 < |r| < 0.8: Moderate correlation
- |r| < 0.5: Weak correlation
- Limitations:
- Only measures linear relationship
- Sensitive to outliers
- Correlation does not imply causation
- May hide non-linear relationships
## 5. Discrete Random Variables
### 5.1 Concept of a Discrete Random Variable
- Definition:
- A variable that can take discrete values with specific probabilities
- Each value has a non-zero probability
- Sum of all probabilities equals 1
- Examples:
- Number of heads in coin tosses
- Number of defective items in a sample
- Number of accidents per day
### 5.2 Probability and Distribution Functions
- Probability Function:
- p(x) = P(X = x)
- Gives probability for each possible value of X
- Properties:
- p(x) ≥ 0 for all x
- Σp(x) = 1 for all possible x values
- Cumulative Distribution Function (CDF):
- F(x) = P(X ≤ x) = Σp(t) for all t ≤ x
- Gives probability that X is less than or equal to x
- Properties:
- 0 ≤ F(x) ≤ 1
- F(x) is non-decreasing
- lim(x→-∞) F(x) = 0 and lim(x→∞) F(x) = 1
### 5.3 Mean and Variance
- Expected Value (Mean):
- E(X) = μ = Σ[x × p(x)] for all possible x values
- Represents the long-run average value
- Variance:
- Var(X) = σ² = E[(X - μ)²] = Σ[(x - μ)² × p(x)]
- Alternative formula: Var(X) = E(X²) - [E(X)]²
- Where E(X²) = Σ[x² × p(x)]
- Properties:
- For constant a and b:
- E(aX + b) = aE(X) + b
- Var(aX + b) = a²Var(X)
### 5.4 Discrete Uniform Distribution
- Definition:
- Equal probability for each possible value
- X ~ U(a, b) where a, b are integers and a < b
- Probability Function:
- p(x) = 1/(b - a + 1) for x = a, a+1, a+2, ..., b
- p(x) = 0 otherwise
- Mean and Variance:
- E(X) = (a + b)/2
- Var(X) = [(b - a + 1)² - 1]/12
- Examples:
- Fair die roll: X ~ U(1, 6)
- Random selection of a day in a week: X ~ U(1, 7)
## 6. The Normal Distribution
### 6.1 Properties of the Normal Distribution
- Definition:
- Continuous probability distribution
- Notation: X ~ N(μ, σ²)
- Parameters: Mean μ and variance σ²
- Characteristics:
- Bell-shaped and symmetric about the mean
- Mean = median = mode
- Asymptotic to the x-axis (never touches)
- Approximately 68% of data within μ ± σ
- Approximately 95% of data within μ ± 2σ
- Approximately 99.7% of data within μ ± 3σ
- Standard Normal Distribution:
- Z ~ N(0, 1)
- Transformation: Z = (X - μ)/σ
- Used with tables of the cumulative distribution function
### 6.2 Using Normal Distribution Tables
- Standardization:
- Convert X ~ N(μ, σ²) to Z ~ N(0, 1) using Z = (X - μ)/σ
- Find probabilities using standard normal tables
- Finding Probabilities:
- P(X ≤ a) = P(Z ≤ (a - μ)/σ)
- P(X > a) = 1 - P(X ≤ a)
- P(a < X ≤ b) = P(X ≤ b) - P(X ≤ a)
- Finding Values:
- For probability p, find z value where P(Z ≤ z) = p
- Convert back to x using x = μ + zσ
- Applications:
- Calculating probabilities for normal random variables
- Finding confidence intervals
- Hypothesis testing

`;