export const PURE_MATH_3_CONTENT = `
# Pure Mathematics 3  
## 1. Algebra and Functions
### 1.1 Rational Expressions
- Simplification Techniques:
- Factorizing numerator and denominator
- Cancelling common factors
- Performing algebraic division
- Examples:
- 1/(ax + b)
- (ax + b)/(px² + qx + r)
- x³/(x² - 1)
- Process:
- Factorize expressions where possible
- Look for common factors to cancel
- For division, use polynomial division methods
### 1.2 Functions and Composition
- Definition of a Function:
- A mapping from one set (domain) to another set (range)
- Notation: f: x → y or y = f(x)
- Types of Functions:
- One-to-one: Each element in the range corresponds to exactly one element in the domain
- Many-to-one: Multiple elements in the domain can map to the same element in the range
- Composition of Functions:
- (f ∘ g)(x) = f(g(x))
- First apply g, then apply f to the result
- Inverse Functions:
- A function f has an inverse f⁻¹ if f is one-to-one
- f⁻¹(f(x)) = x for all x in the domain of f
- f(f⁻¹(x)) = x for all x in the range of f
- The graph of f⁻¹ is the reflection of the graph of f in the line y = x
### 1.3 The Modulus Function
- Definition:
- |x| = x if x ≥ 0
- |x| = -x if x < 0
- Graph of y = |x|:
- V-shaped, with vertex at the origin
- Domain: All real numbers
- Range: Non-negative real numbers
- More Complex Modulus Graphs:
- y = |ax + b|: V-shaped, with vertex at x = -b/a
- y = |f(x)|: Take the graph of y = f(x) and reflect any parts below the x-axis
- y = f(|x|): Apply the function f to the graph of y = |x|
- Example:
- Solving |2x - 1| = x + 5:
- Case 1: If 2x - 1 ≥ 0 (i.e., x ≥ 1/2), then 2x - 1 = x + 5
- Solving: x = 6
- Check: 6 ≥ 1/2, so this is valid
- Case 2: If 2x - 1 < 0 (i.e., x < 1/2), then -(2x - 1) = x + 5
- Solving: -2x + 1 = x + 5, which gives x = -4/3
- Check: -4/3 < 1/2, so this is valid
- Therefore x = 6 or x = -4/3
### 1.4 Transformations of Functions
- Basic Transformations:
- y = af(x): Vertical stretch by factor a
- y = f(x) + a: Vertical translation by a units
- y = f(x + a): Horizontal translation by -a units
- y = f(ax): Horizontal stretch by factor 1/a
- Examples:
- y = 2f(3x): Horizontal compression by factor 1/3, vertical stretch by factor 2
- y = f(-x) + 1: Reflection in the y-axis, followed by a vertical translation of 1 unit up
- y = 3 + sin(2x): The sine curve with amplitude 1, period π, shifted up 3 units
- y = -cos(x/4 + π): The cosine curve with amplitude 1, period 8π, phase shift -π, reflected in the x-axis
## 2. Trigonometry
### 2.1 Secant, Cosecant and Cotangent
- Definitions:
- sec θ = 1/cos θ
- cosec θ = 1/sin θ
- cot θ = 1/tan θ = cos θ/sin θ
- Domains:
- sec θ is defined for all θ where cos θ ≠ 0 (i.e., θ ≠ (2n+1)π/2)
- cosec θ is defined for all θ where sin θ ≠ 0 (i.e., θ ≠ nπ)
- cot θ is defined for all θ where sin θ ≠ 0 (i.e., θ ≠ nπ)
- Inverse Functions:
- arcsin x = sin⁻¹ x: value of θ in [-π/2, π/2] such that sin θ = x
- arccos x = cos⁻¹ x: value of θ in [0, π] such that cos θ = x
- arctan x = tan⁻¹ x: value of θ in (-π/2, π/2) such that tan θ = x
- Graphs:
- y = sec x: Periodic with period 2π, asymptotes at x = (2n+1)π/2
- y = cosec x: Periodic with period 2π, asymptotes at x = nπ
- y = cot x: Periodic with period π, asymptotes at x = nπ
### 2.2 Additional Trigonometric Identities
- Pythagorean Identities:
- sec² θ = 1 + tan² θ
- cosec² θ = 1 + cot² θ
- Applications:
- Simplifying trigonometric expressions
- Solving trigonometric equations
- Proving trigonometric identities
### 2.3 Double Angle Formulae
- Main Formulae:
- sin 2θ = 2 sin θ cos θ
- cos 2θ = cos² θ - sin² θ = 2cos² θ - 1 = 1 - 2sin² θ
- tan 2θ = 2tan θ/(1 - tan² θ)
- Applications:
- Half-angle formulae can be derived from double-angle formulae
- Useful for integrating powers of trigonometric functions
- Used to solve equations like sin 2x + cos x = 0
### 2.4 Addition Formulae
- Main Formulae:
- sin(A + B) = sin A cos B + cos A sin B
- sin(A - B) = sin A cos B - cos A sin B
- cos(A + B) = cos A cos B - sin A sin B
- cos(A - B) = cos A cos B + sin A sin B
- tan(A + B) = (tan A + tan B)/(1 - tan A tan B)
- tan(A - B) = (tan A - tan B)/(1 + tan A tan B)
- Applications:
- Converting a cos θ + b sin θ to R cos(θ - α) or R sin(θ + α), where:
- R = √(a² + b²)
- α = tan⁻¹(b/a) or α = tan⁻¹(a/b) depending on the form needed
## 3. Exponentials and Logarithms
### 3.1 The Function e^x
- Properties:
- e is approximately 2.71828...
- y = e^x is its own derivative: d/dx(e^x) = e^x
- Domain: All real numbers
- Range: All positive real numbers
- Strictly increasing function
- Graph:
- Passes through (0, 1)
- Asymptotic to the x-axis as x → -∞
- Grows faster than any power of x as x → ∞
- Transformations:
- y = e^(ax+b) + c: Horizontal scale factor 1/a, horizontal shift -b/a, vertical shift c
### 3.2 The Function ln x
- Properties:
- ln x is the inverse function of e^x
- ln(e^x) = x for all real x
- e^(ln x) = x for all x > 0
- Domain: All positive real numbers
- Range: All real numbers
- Strictly increasing function
- Graph:
- Passes through (1, 0)
- Asymptotic to the y-axis as x → 0+
- Grows slower than any power of x as x → ∞
- Solving Equations:
- e^(ax+b) = p → ax + b = ln p → x = (ln p - b)/a
- ln(ax + b) = q → ax + b = e^q → x = (e^q - b)/a
### 3.3 Logarithmic Graphs
- Relationship y = ax^n:
- Take logarithms: log y = log a + n log x
- Straight line with gradient n and y-intercept log a
- Relationship y = kb^x:
- Take logarithms: log y = log k + x log b
- Straight line with gradient log b and y-intercept log k
- Process:
- Plot log y against log x to find n and log a for y = ax^n
- Plot log y against x to find log k and log b for y = kb^x
## 4. Differentiation
### 4.1 Standard Derivatives
- Basic Rules:
- d/dx(e^kx) = ke^kx
- d/dx(ln(kx)) = 1/x
- d/dx(sin kx) = k cos kx
- d/dx(cos kx) = -k sin kx
- d/dx(tan kx) = k sec² kx
- Applications:
- Finding gradients of curves
- Determining equations of tangents and normals
- Locating maxima, minima, and points of inflection
### 4.2 Product, Quotient and Chain Rules
- Product Rule:
- If y = u × v, then dy/dx = u(dv/dx) + v(du/dx)
- In Leibniz notation: d/dx(uv) = u(dv/dx) + v(du/dx)
- Quotient Rule:
- If y = u/v, then dy/dx = [v(du/dx) - u(dv/dx)]/v²
- In Leibniz notation: d/dx(u/v) = [v(du/dx) - u(dv/dx)]/v²
- Chain Rule:
- If y = f(g(x)), then dy/dx = f'(g(x)) × g'(x)
- In Leibniz notation: dy/dx = (dy/du) × (du/dx), where u = g(x)
- Examples:
- d/dx(x³ sin x) = 3x² sin x + x³ cos x
- d/dx(e^x/x) = [xe^x - e^x]/x² = e^x(x - 1)/x²
- d/dx(cos x²) = -2x sin x²
### 4.3 Inverse Function Differentiation
- Relationship:
- If y = f(x) and x = f⁻¹(y), then dy/dx = 1/(dx/dy)
- In function notation: (f⁻¹)'(y) = 1/f'(f⁻¹(y))
- Example:
- If x = sin³ y, find dy/dx
- dx/dy = 3sin² y cos y
- Therefore, dy/dx = 1/(3sin² y cos y)
### 4.4 Exponential Growth and Decay
- Mathematical Models:
- y = y₀e^kt
- Where y₀ is the initial value and k is the growth/decay constant
- Growth when k > 0, decay when k < 0
- Properties:
- dy/dt = ky, showing that the rate of change is proportional to the current value
- Half-life (when k < 0): T₁/₂ = ln(2)/|k|
- Doubling time (when k > 0): T₂ = ln(2)/k
- Applications:
- Population growth
- Radioactive decay
- Compound interest
- Temperature cooling (Newton's Law of Cooling)
## 5. Integration
### 5.1 Standard Integrals
- Basic Formulae:
- ∫ e^kx dx = (1/k)e^kx + c
- ∫ (1/x) dx = ln|x| + c
- ∫ sin kx dx = -(1/k)cos kx + c
- ∫ cos kx dx = (1/k)sin kx + c
- Applications:
- Finding areas under curves
- Solving differential equations
- Calculating volumes of revolution
### 5.2 Integration Using Recognition
- Integration by Inspection:
- ∫ f'(x)/f(x) dx = ln|f(x)| + c
- ∫ f'(x)[f(x)]^n dx = [f(x)]^(n+1)/(n+1) + c (n ≠ -1)
- Examples:
- ∫ cos x/sin x dx = ln|sin x| + c (recognizing f'(x)/f(x) with f(x) = sin x)
- ∫ 2x(x² + 1)³ dx = (x² + 1)⁴/4 + c (recognizing f'(x)[f(x)]^n with f(x) = x² + 1, f'(x) = 2x, n = 3)
## 6. Numerical Methods
### 6.1 Location of Roots
- Change of Sign Method:
- If f(a) and f(b) have opposite signs, then f(x) = 0 has at least one solution in the interval [a, b], provided f is continuous
- Process:
- Find an interval [a, b] where f(a) × f(b) < 0
- Divide the interval and check which sub-interval contains the root
- Repeat the process to narrow down the location of the root
- Graphical Interpretation:
- The graph of y = f(x) crosses the x-axis somewhere in the interval [a, b]
### 6.2 Iterative Methods
- Fixed-Point Iteration:
- Rearrange f(x) = 0 to x = g(x)
- Choose a starting value x₀
- Generate the sequence xₙ₊₁ = g(xₙ)
- If the sequence converges, it converges to a root of f(x) = 0
- Convergence Conditions:
- The sequence will converge if |g'(x)| < 1 in the neighborhood of the root
- If |g'(x)| > 1, the iteration may diverge
- The closer |g'(x)| is to 0, the faster the convergence
- Examples:
- To solve x³ + x - 1 = 0, rearrange to x = (1 - x³)^(1/3) and iterate
- To find √5, use the iteration xₙ₊₁ = 0.5(xₙ + 5/xₙ)
`;