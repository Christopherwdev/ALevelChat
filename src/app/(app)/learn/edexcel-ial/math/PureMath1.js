export const PURE_MATH_1_CONTENT = `
# Pure Mathematics 1  

## 1. Algebra and Functions
### 1.1 Laws of Indices for Rational Exponents
- Basic Rules:
- a^m × a^n = a^(m+n)
- a^m ÷ a^n = a^(m-n)
- (a^m)^n = a^(mn)
- Rational Exponents:
- a^(m/n) = ^n√(a^m)
- a^(m/n) is equivalent to (^n√a)^m
- Example: 27^(2/3) = (∛27)^2 = 3^2 = 9
### 1.2 Surds
- Definition:
- A surd is an irrational number expressed as a root.
- Basic Operations:
- √a × √b = √(ab)
- √a ÷ √b = √(a/b)
- Rationalising the Denominator:
- For expressions like 1/√3:
- Multiply both numerator and denominator by √3:
- 1/√3 = (1×√3)/(√3×√3) = √3/3
- For expressions like 1/(√a + √b):
- Multiply by (√a - √b)/(√a - √b):
- 1/(√a + √b) = (√a - √b)/((√a + √b)(√a - √b)) = (√a - √b)/(a - b)
### 1.3 Quadratic Functions and Their Graphs
- Standard Form:
- f(x) = ax² + bx + c, where a ≠ 0
- Graphical Properties:
- Parabola shape
- Vertex at x = -b/(2a)
- y-intercept at (0, c)
- x-intercepts (if any) at solutions of ax² + bx + c = 0
- Opens upward if a > 0, downward if a < 0
### 1.4 The Discriminant of a Quadratic Function
- Discriminant Formula:
- Δ = b² - 4ac
- Significance:
- If Δ > 0: Two distinct real roots
- If Δ = 0: One repeated real root
- If Δ < 0: No real roots (two complex roots)
### 1.5 Completing the Square
- Process:
- Convert ax² + bx + c to a[(x + b/(2a))² - b²/(4a²)] + c
- Simplify to a(x + b/(2a))² + (c - b²/(4a))
- Example:
- 2x² + 8x + 7 = 2(x² + 4x) + 7 = 2(x + 2)² - 8 + 7 = 2(x + 2)² - 1
- Solving Quadratic Equations Methods:
- Factorisation: ax² + bx + c = 0 → (px + q)(rx + s) = 0
- Formula: x = (-b ± √(b² - 4ac))/(2a)
- Completing the square: x = -b/(2a) ± √(b² - 4ac)/(2a)
### 1.6 Simultaneous Equations
- Analytical Solution by Substitution:
- Express one variable in terms of the other from one equation
- Substitute into the second equation
- Solve the resulting equation
- Substitute back to find the other variable
- Example:
- For {y = 2x + 1, y = x² - 3}, substitute y = 2x + 1 into y = x² - 3:
- 2x + 1 = x² - 3
- x² - 2x - 4 = 0
- Solve to find x, then substitute back to find y
### 1.7 Interpreting Linear and Quadratic Inequalities Graphically
- Linear Inequalities:
- ax + b > cx + d represents the region above the line y = (c-a)x + (d-b)
- Quadratic Inequalities:
- px² + qx + r ≥ 0 represents the region on or above the parabola y = px² + qx + r
- px² + qx + r < ax + b represents the region where the parabola y = px² + qx + r is below the line y = ax + b
### 1.8 Representing Inequalities Graphically
- Conventions:
- Solid line for ≤ or ≥
- Dotted line for < or >
- Shading for the region that satisfies the inequality
- Examples:
- y > x + 2: Region above the line y = x + 2 (dotted line)
- y ≤ 2x² - 3x + 1: Region on or below the parabola y = 2x² - 3x + 1 (solid line)
### 1.9 Solutions of Linear and Quadratic Inequalities
- Linear Inequalities:
- Rearrange to get variable on one side
- Reverse the inequality sign if multiplying/dividing by negative number
- Quadratic Inequalities:
- Find critical points (where expression equals zero)
- Test intervals between critical points
- Solution is the union of intervals where inequality is satisfied
### 1.10 Algebraic Manipulation of Polynomials
- Expanding Brackets:
- (a + b)(c + d) = ac + ad + bc + bd
- Collecting Like Terms:
- 2x³ + 3x² - x³ + 5x² = x³ + 8x²
- Factorisation:
- Common Factor: ax + ay = a(x + y)
- Difference of Squares: a² - b² = (a+b)(a-b)
- Quadratic Trinomial: ax² + bx + c = a(x + p)(x + q) where p + q = b/a and pq = c/a
- Cubic Polynomials: x³ + px² + qx + r can sometimes be factored as (x + s)(x² + tx + u)
### 1.11 Graphs of Functions
- Functions to Know:
- Quadratic: y = ax² + bx + c
- Cubic: y = ax³ + bx² + cx + d
- Reciprocal: y = k/x or y = k/x²
- Trigonometric: y = sin x, y = cos x, y = tan x
- Key Features:
- Asymptotes: Values that the curve approaches but never reaches
- Intercepts: Points where the curve crosses the axes
- Solving Equations Graphically: Finding the x-coordinates where two curves intersect
### 1.12 Transformations of Graphs
- Types of Transformations:
- y = af(x): Vertical stretch by factor a
- y = f(x) + a: Vertical translation by a units
- y = f(x + a): Horizontal translation by -a units
- y = f(ax): Horizontal stretch by factor 1/a
- Examples:
- y = 2 sin x: Amplitude is 2 (vertical stretch)
- y = sin x + 3: Graph of sin x shifted 3 units up
- y = sin(x - π/2): Graph of sin x shifted π/2 units right
- y = sin 2x: Period is π (compressed horizontally)
## 2. Coordinate Geometry in the (x, y) Plane
### 2.1 Equation of a Straight Line
- Forms of Line Equations:
- Gradient-intercept form: y = mx + c
- Point-gradient form: y - y₁ = m(x - x₁)
- General form: ax + by + c = 0
- Finding Line Equations:
- Through two points (x₁, y₁) and (x₂, y₂):
- m = (y₂ - y₁)/(x₂ - x₁)
- y - y₁ = m(x - x₁)
- Parallel to line with gradient m through point (x₁, y₁):
- y - y₁ = m(x - x₁)
- Perpendicular to line with gradient m through point (x₁, y₁):
- y - y₁ = (-1/m)(x - x₁)
### 2.2 Conditions for Parallel and Perpendicular Lines
- Parallel Lines:
- Two lines with gradients m₁ and m₂ are parallel if m₁ = m₂
- Perpendicular Lines:
- Two lines with gradients m₁ and m₂ are perpendicular if m₁ × m₂ = -1
- Example:
- Line perpendicular to 3x + 4y = 18 through point (2, 3):
- Gradient of 3x + 4y = 18 is -3/4
- Perpendicular gradient is 4/3
- Equation: y - 3 = (4/3)(x - 2)
## 3. Trigonometry
### 3.1 The Sine and Cosine Rules
- Sine Rule:
- a/sin A = b/sin B = c/sin C
- Cosine Rule:
- a² = b² + c² - 2bc cos A
- b² = a² + c² - 2ac cos B
- c² = a² + b² - 2ab cos C
- Area of a Triangle:
- Area = (1/2)ab sin C
- Also = (1/2)bc sin A = (1/2)ac sin B
- The Ambiguous Case:
- When using the sine rule to find an angle, sin⁻¹ can give two possible angles (α and 180° - α)
- Need to determine which angle is correct based on the context
### 3.2 Radian Measure
- Definition:
- 1 radian is the angle subtended at the center of a circle by an arc equal in length to the radius
- Conversion:
- 360° = 2π radians
- 1 radian = 57.3° (approximately)
- π radians = 180°
- Arc Length and Area:
- Arc length s = rθ (where r is radius and θ is angle in radians)
- Area of sector A = (1/2)r²θ
### 3.3 Trigonometric Functions
- Graphs:
- y = sin x: Period 2π, amplitude 1, domain all reals, range [-1, 1]
- y = cos x: Period 2π, amplitude 1, domain all reals, range [-1, 1]
- y = tan x: Period π, asymptotes at x = (n + 1/2)π, domain all reals except x = (n + 1/2)π, range all reals
- Symmetries:
- sin(-x) = -sin x (odd function)
- cos(-x) = cos x (even function)
- tan(-x) = -tan x (odd function)
- Modified Graphs:
- y = a sin x: Amplitude a
- y = sin(nx): Period 2π/n
- y = sin(x + α): Phase shift -α
## 4. Differentiation
### 4.1 The Derivative
- Definition:
- The derivative of f(x) is the gradient of the tangent to the curve y = f(x) at any point
- Notation:
- dy/dx, f'(x), ẏ all represent the derivative of y with respect to x
- Interpretation:
- Rate of change of y with respect to x
- Instantaneous rate of change at a point
- Second Derivative:
- Notation: d²y/dx², f''(x), ÿ
- Represents the rate of change of the gradient
### 4.2 Differentiation Rules
- Power Rule:
- If y = xⁿ, then dy/dx = nxⁿ⁻¹
- Sum/Difference Rule:
- If y = f(x) ± g(x), then dy/dx = f'(x) ± g'(x)
- Constant Multiple Rule:
- If y = kf(x), then dy/dx = kf'(x)
- Examples:
- If y = 3x⁵ - 2x³ + 7x - 1, then dy/dx = 15x⁴ - 6x² + 7
- If y = (2x + 5)(x - 1), expand first: y = 2x² - 2x + 5x - 5 = 2x² + 3x - 5
- Then differentiate: dy/dx = 4x + 3
### 4.3 Applications of Differentiation
- Finding Gradients:
- The gradient at point (a, f(a)) is f'(a)
- Tangents:
- Equation of tangent at point (a, f(a)): y - f(a) = f'(a)(x - a)
- Normals:
- Equation of normal at point (a, f(a)): y - f(a) = -1/f'(a)(x - a)
- Example:
- For curve y = x³ - 3x + 2, find the equation of the tangent at point (2, 4)
- f'(x) = 3x² - 3
- f'(2) = 3(2)² - 3 = 12 - 3 = 9
- Tangent equation: y - 4 = 9(x - 2) or y = 9x - 14
## 5. Integration
### 5.1 Indefinite Integration
- Definition:
- Integration is the reverse process of differentiation
- If F'(x) = f(x), then ∫f(x)dx = F(x) + C, where C is the constant of integration
- Constant of Integration:
- Needed because differentiation of constants gives zero
- Represents the family of all antiderivatives of f(x)
### 5.2 Integration Rules
- Power Rule:
- ∫xⁿdx = xⁿ⁺¹/(n+1) + C, where n ≠ -1
- Sum/Difference Rule:
- ∫[f(x) ± g(x)]dx = ∫f(x)dx ± ∫g(x)dx
- Constant Multiple Rule:
- ∫kf(x)dx = k∫f(x)dx
- Examples:
- ∫(3x² + 2x - 1)dx = 3x³/3 + 2x²/2 - x + C = x³ + x² - x + C
- ∫√xdx = ∫x^(1/2)dx = x^(3/2)/(3/2) + C = (2/3)x^(3/2) + C
- Finding Equations of Curves:
- Given f'(x) and a point on the curve, find f(x) by integration and using the point to determine C
- Example: If f'(x) = 2x + 3 and f(2) = 10, then f(x) = x² + 3x + C
- Substitute (2, 10): 10 = 2² + 3(2) + C = 4 + 6 + C = 10 + C, so C = 0
- Therefore, f(x) = x² + 3x
`;