import sys
import json

file_path = sys.argv[1]

result = {
    "problem_statement": 6,
    "solution_product": 6,
    "market_opportunity": 6,
    "business_model": 5,
    "competitive_landscape": 4,
    "team": 5,
    "traction": 3,
    "financial_projections": 2,
    "clarity_presentation": 6
}

print(json.dumps(result))