export const PURE_MATH_4_CONTENT = `
# Pure Mathematics 4  
## 1. Proof
### 1.1 Proof by Contradiction
- Process:
- Assume the statement to be proven is false
- Show that this assumption leads to a logical contradiction
- Conclude that the original statement must be true
- Classic Examples:
- Proof that √2 is irrational:
- Assume √2 = p/q where p and q are integers with no common factors
- Square both sides: 2 = p²/q²
- Rearrange: p² = 2q²
- This means p² is even, so p must be even
- If p is even, then p = 2k for some integer k
- Substitute: (2k)² = 2q²
- Simplify: 4k² = 2q²
- Divide by 2: 2k² = q²
- This means q² is even, so q must be even
- But if both p and q are even, they have a common factor of 2
- This contradicts our assumption that p and q have no common factors
- Therefore, √2 cannot be expressed as p/q, so it is irrational
- Proof that there are infinitely many primes:
- Assume there are finitely many primes: p₁, p₂, ..., pₙ
- Consider the number P = p₁ × p₂ × ... × pₙ + 1
- P is either prime or not prime
- If P is prime, it is a prime not in our list, contradicting our assumption
- If P is not prime, it has a prime factor p
- This prime factor p cannot be any of p₁, p₂, ..., pₙ, because dividing P by any of these leaves remainder 1
- So we have found a prime p not in our list, contradicting our assumption
- Therefore, there must be infinitely many primes
## 2. Algebra and Functions
### 2.1 Partial Fractions
- Definition:
- Decomposing a rational function into a sum of simpler fractions
- Types of Decomposition:
- For distinct linear factors (ax + b):
- A/(ax + b) + B/(cx + d) + ...
- For repeated linear factors (ax + b)ⁿ:
- A/(ax + b) + B/(ax + b)² + ... + K/(ax + b)ⁿ
- For irreducible quadratic factors (ax² + bx + c):
- (Ax + B)/(ax² + bx + c)
- Process:
- Express the rational function with a common denominator
- Compare coefficients or substitute specific values to find the constants
- Example:
- Decompose (4x - 3)/((x - 1)(x + 2)):
- (4x - 3)/((x - 1)(x + 2)) = A/(x - 1) + B/(x + 2)
- 4x - 3 = A(x + 2) + B(x - 1)
- 4x - 3 = Ax + 2A + Bx - B
- 4x - 3 = (A + B)x + (2A - B)
- Comparing coefficients:
- A + B = 4
- 2A - B = -3
- Solving: A = 1, B = 3
- Therefore, (4x - 3)/((x - 1)(x + 2)) = 1/(x - 1) + 3/(x + 2)
## 3. Coordinate Geometry in the (x, y) Plane
### 3.1 Parametric Equations
- Definition:
- Expressing x and y coordinates in terms of a parameter t
- Form: x = f(t), y = g(t)
- Converting Between Forms:
- Parametric to Cartesian:
- Eliminate the parameter t between the equations
- Cartesian to Parametric:
- Many possible parameterizations for a given curve
- Common Examples:
- Circle: x = a + r cos t, y = b + r sin t (center (a, b), radius r)
- Line: x = x₀ + ta, y = y₀ + tb (point (x₀, y₀), direction vector (a, b))
- Ellipse: x = a cos t, y = b sin t (semi-major axis a, semi-minor axis b)
- Applications:
- Describing complex paths
- Finding tangents and normals
- Calculating arc lengths and areas
## 4. Binomial Expansion
### 4.1 Binomial Series for Rational n
- General Form:
- (1 + x)ⁿ = 1 + nx + n(n-1)x²/2! + n(n-1)(n-2)x³/3! + ... for |x| < 1
- Also written as (1 + x)ⁿ = ∑(r=0 to ∞) (nr)x^r
- Expansion of (ax + b)ⁿ:
- (ax + b)ⁿ = bⁿ(1 + (ax/b))ⁿ
- Expand using the binomial series with |ax/b| < 1
- Applications:
- Approximating complex expressions
- Expanding rational functions (after partial fraction decomposition)
- Finding specific terms in an expansion
- Example:
- Expand (1 - 2x)^(-1/2) for |2x| < 1:
- Using (1 + x)ⁿ with n = -1/2 and x = -2x:
- (1 - 2x)^(-1/2) = 1 + (-1/2)(-2x) + (-1/2)(-3/2)(-2x)²/2! + ...
- = 1 + x + (3/2)x² + ...
## 5. Differentiation
### 5.1 Implicit Differentiation
- Definition:
- Finding dy/dx when the relationship between x and y is given implicitly
- Process:
- Differentiate both sides of the equation with respect to x
- Remember the chain rule when differentiating terms with y
- Solve for dy/dx
- Example:
- For x² + y² = 25:
- Differentiate both sides: 2x + 2y(dy/dx) = 0
- Solve for dy/dx: dy/dx = -x/y
### 5.2 Parametric Differentiation
- Finding dy/dx when x = f(t) and y = g(t):
- dy/dx = (dy/dt)/(dx/dt) = g'(t)/f'(t)
- Finding d²y/dx²:
- d²y/dx² = d/dx(dy/dx) = (d/dt(dy/dx))/(dx/dt)
- Applications:
- Finding equations of tangents and normals to parametric curves
- Determining points where the tangent is horizontal or vertical
- Locating points of inflection
### 5.3 Formation of Differential Equations
- Process:
- Start with a statement about the rate of change
- Express as a differential equation in terms of the variables and their derivatives
- Identify the order and type of the differential equation
- Common Examples:
- Exponential growth: dy/dt = ky
- Cooling: dT/dt = k(T - T₀)
- Connected rates: Using related rates to form equations
- Example:
- A population P grows at a rate proportional to the current population:
- dP/dt = kP
- where k is the growth constant
## 6. Integration
### 6.1 Volume of Revolution
- About the x-axis:
- V = π∫[a to b] y² dx
- Where y = f(x) is the curve being rotated
- About the y-axis:
- V = π∫[c to d] x² dy
- Where x = g(y) is the curve being rotated
- For Parametric Curves:
- About the x-axis: V = π∫[t₁ to t₂] y² (dx/dt) dt
- About the y-axis: V = π∫[t₁ to t₂] x² (dy/dt) dt
- Example:
- Volume when the region under y = √x from x = 0 to x = 4 is rotated about the x-axis:
- V = π∫[0 to 4] (√x)² dx = π∫[0 to 4] x dx = π[x²/2]₀⁴ = 8π
### 6.2 Integration by Substitution
- Method:
- Set u = g(x), so that dx = (dx/du) du
- Replace all terms in the integral with expressions in u
- Evaluate the simpler integral in terms of u
- Substitute back to get the result in terms of x
- Example:
- ∫ x√(x² - 3) dx:
- Let u = x² - 3, so du = 2x dx
- x dx = du/2
- ∫ x√(x² - 3) dx = ∫ √u × (du/2) = (1/2)∫ u^(1/2) du
- = (1/2) × (u^(3/2)/3/2) + C = (1/3)u^(3/2) + C
- = (1/3)(x² - 3)^(3/2) + C
### 6.3 Integration by Parts
- Formula:
- ∫ u(dv/dx) dx = uv - ∫ v(du/dx) dx
- Strategy:
- Choose u and dv/dx to make the resulting integral simpler
- Generally, set u to the function that gets simpler when differentiated
- Apply repeatedly for expressions like ∫ xⁿe^x dx
- Examples:  
∫ x ln x dx:
- u = ln x, dv/dx = x
- du/dx = 1/x, v = x²/2
- ∫ x ln x dx = (x²/2) ln x - ∫ (x²/2) × (1/x) dx
- = (x²/2) ln x - (1/2)∫ x dx
- = (x²/2) ln x - x²/4 + C
- ∫ e^x sin x dx:
- u = sin x, dv/dx = e^x
- du/dx = cos x, v = e^x  
∫ e^x sin x dx = e^x sin x - ∫ e^x cos x dx
- For the second integral, apply parts again:
- u = cos x, dv/dx = e^x
- du/dx = -sin x, v = e^x
- ∫ e^x cos x dx = e^x cos x - ∫ -e^x sin x dx = e^x cos x + ∫ e^x sin x dx
- Substituting: ∫ e^x sin x dx = e^x sin x - (e^x cos x + ∫ e^x sin x dx)
- 2∫ e^x sin x dx = e^x sin x - e^x cos x
- ∫ e^x sin x dx = (e^x sin x - e^x cos x)/2 + C
### 6.4 Integration Using Partial Fractions
- Process:
- Decompose the rational function into partial fractions
- Integrate each simpler fraction term
- Combine the results
- Example:
- ∫ (3x + 5)/((x - 1)(x + 2)) dx:
- Decompose: (3x + 5)/((x - 1)(x + 2)) = A/(x - 1) + B/(x + 2)
- Find A and B: A = 1, B = 2
- ∫ (3x + 5)/((x - 1)(x + 2)) dx = ∫ (1/(x - 1) + 2/(x + 2)) dx
- = ln|x - 1| + 2ln|x + 2| + C
- = ln|(x - 1)(x + 2)²| + C
### 6.5 First Order Differential Equations
- Separable Equations:
- Form: dy/dx = f(x)g(y)  
Solution: ∫ (1/g(y)) dy = ∫ f(x) dx + C
- Process:
- Separate the variables: (1/g(y)) dy = f(x) dx
- Integrate both sides
- Solve for y if possible
- Use initial conditions to find the particular solution
- Example:
- Solve dy/dx = xy with y(0) = 2:
- Separate variables: (1/y) dy = x dx
- Integrate: ln|y| = x²/2 + C
- Solve for y: y = ±e^(x²/2 + C) = ±e^C × e^(x²/2) = Ke^(x²/2)
- Using y(0) = 2: 2 = Ke^0 = K
- Particular solution: y = 2e^(x²/2)
### 6.6 Area with Parametric Equations
- Formula:
- Area under the curve from t = a to t = b: ∫[a to b] y(dx/dt) dt
- Process:
- Express y and dx/dt in terms of the parameter t
- Integrate y(dx/dt) with respect to t between appropriate limits
- Example:
- Area under the curve x = t², y = t³ from t = 0 to t = 1:
- dx/dt = 2t
- ∫[0 to 1] t³ × 2t dt = 2∫[0 to 1] t⁴ dt = 2[t⁵/5]₀¹ = 2/5
## 7. Vectors
### 7.1 Vectors in Two and Three Dimensions
- Notation:
- Component form: ai + bj + ck
- Bold letter: a, b
- Components:
- In 2D: (a, b) or ai + bj
- In 3D: (a, b, c) or ai + bj + ck
### 7.2 Magnitude of a Vector
- Formula:
- |a| = √(a² + b² + c²) for a = ai + bj + ck
- Unit Vector:
- â = a/|a|
- Has magnitude 1 and the same direction as a
### 7.3 Vector Operations
- Addition:
- a + b = (a₁ + b₁)i + (a₂ + b₂)j + (a₃ + b₃)k
- Scalar Multiplication:
- λa = λa₁i + λa₂j + λa₃k
- Geometric Interpretation:
- Vector addition follows the parallelogram law
- Scalar multiplication changes the magnitude and possibly direction
### 7.4 Position Vectors
- Definition:
- The vector from the origin O to a point P, denoted by OP
- For point P(x, y, z), the position vector is xi + yj + zk
- Relative Position:
- Vector from A to B: AB = OB - OA
- If A has position vector a and B has position vector b, then AB = b - a
### 7.5 Distance Between Points
- Formula:
- Distance between (x₁, y₁, z₁) and (x₂, y₂, z₂):
- d = √((x₂ - x₁)² + (y₂ - y₁)² + (z₂ - z₁)²)
- Equivalently, d = |PQ| = |q - p|
### 7.6 Vector Equations of Lines
- Parametric Form:
- r = a + tb
- Point with position vector a and direction vector b
- Another Form:
- r = c + t(d - c)
- Line through points with position vectors c and d
- Line Relationships:
- Parallel lines have parallel direction vectors: b₁ = λb₂
- Intersecting lines: Their direction vectors are not parallel, and there exist parameters t₁ and t₂ such that a₁ + t₁b₁ = a₂ + t₂b₂
- Skew lines: Neither parallel nor intersecting
### 7.7 The Scalar Product
- Definition:
- a · b = a₁b₁ + a₂b₂ + a₃b₃ = |a||b|cosθ
- Where θ is the angle between the vectors
- Properties:
- a · b = b · a (commutative)
- (λa) · b = λ(a · b) (scalar multiplication)
- a · (b + c) = a · b + a · c (distributive)
- Applications:
- Finding the angle between vectors: cosθ = (a · b)/(|a||b|)
- Testing for perpendicularity: a ⊥ b if and only if a · b = 0
- Finding the scalar projection of one vector onto another
- Example:
- For a = 2i + 3j - k and b = i - 2j + 2k:
- a · b = 2(1) + 3(-2) + (-1)(2) = 2 - 6 - 2 = -6
- |a| = √(2² + 3² + (-1)²) = √14  
|b| = √(1² + (-2)² + 2²) = √9 = 3
- cosθ = -6/(√14 × 3) = -6/(3√14)
- θ = cos⁻¹(-6/(3√14)) ≈ 114.1°

`;