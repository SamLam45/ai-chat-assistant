#!/usr/bin/env python3
"""
測試智能匹配功能的腳本
"""

import requests
import json

# API 配置
API_BASE_URL = "https://api.alphadeepmind.com"
API_KEY = "YourCustomKey123"  

def test_smart_match():
    """測試智能匹配功能"""
    
    # 測試案例
    test_cases = [
        {
            "name": "經濟系匹配商學系",
            "target_department": "經濟系",
            "target_school": "香港大學",
            "available_departments": ["商學系"],
            "available_schools": ["香港中文大學"]
        },
        {
            "name": "計算機科學匹配資工系",
            "target_department": "計算機科學系",
            "target_school": "清華大學",
            "available_departments": ["商學系", "資工系", "電機系", "計算機科學系", "機械工程系", "傳播學系", "社會科學系", "教育學系", "表演藝術系", "資訊科技系", "會計系", "管理學系", "法律系"],
            "available_schools": ["台灣大學", "清華大學", "香港大學", "香港中文大學", "香港科技大學", "香港城市大學", "香港理工大學", "香港浸會大學", "嶺南大學", "香港教育大學", "香港演藝學院", "香港都會大學", "香港樹仁大學", "香港恒生大學", "聖方濟各大學"]
        },
        {
            "name": "電機工程匹配電機系",
            "target_department": "機械工程",
            "target_school": "台灣大學",
            "available_departments": ["商學系", "資工系", "電機系", "計算機科學系", "機械工程系", "傳播學系", "社會科學系", "教育學系", "表演藝術系", "資訊科技系", "會計系", "管理學系", "法律系"],
            "available_schools": ["台灣大學", "清華大學", "香港大學", "香港中文大學", "香港科技大學", "香港城市大學", "香港理工大學", "香港浸會大學", "嶺南大學", "香港教育大學", "香港演藝學院", "香港都會大學", "香港樹仁大學", "香港恒生大學", "聖方濟各大學"]
        }
    ]
    
    print("🧪 開始測試智能匹配功能...\n")
    
    for i, test_case in enumerate(test_cases, 1):
        print(f"📋 測試案例 {i}: {test_case['name']}")
        print(f"   目標學系: {test_case['target_department']}")
        print(f"   目標學校: {test_case['target_school']}")
        
        try:
            # 發送智能匹配請求
            response = requests.post(
                f"{API_BASE_URL}/smart-match",
                headers={"Content-Type": "application/json"},
                json={
                    "target_department": test_case["target_department"],
                    "target_school": test_case["target_school"],
                    "available_departments": test_case["available_departments"],
                    "available_schools": test_case["available_schools"],
                    "key": API_KEY
                },
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ 匹配成功!")
                print(f"   匹配學系: {result.get('matched_department', 'N/A')}")
                print(f"   匹配學校: {result.get('matched_school', 'N/A')}")
                print(f"   學系相似度: {result.get('department_similarity_score', 'N/A')}")
                print(f"   學校相似度: {result.get('school_similarity_score', 'N/A')}")
                print(f"   匹配理由: {result.get('reasoning', 'N/A')}")
            else:
                print(f"   ❌ 匹配失敗: {response.status_code}")
                print(f"   錯誤訊息: {response.text}")
                
        except Exception as e:
            print(f"   ❌ 請求失敗: {str(e)}")
        
        print("-" * 60)

def test_similarity_analysis():
    """測試相似性分析功能"""
    
    print("\n🔍 開始測試相似性分析功能...\n")
    
    try:
        response = requests.post(
            f"{API_BASE_URL}/similarity-analysis",
            headers={"Content-Type": "application/json"},
            json={
                "query_department": "經濟系",
                "query_school": "香港大學",
                "candidate_departments": ["商學系"],
                "candidate_schools": ["台灣大學"],
                "key": API_KEY
            },
            timeout=30
        )
        
        if response.status_code == 200:
            result = response.json()
            print("✅ 相似性分析成功!")
            print("學系評分:")
            for dept, score_info in result.get("department_scores", {}).items():
                print(f"   {dept}: {score_info.get('score', 'N/A')} - {score_info.get('reason', 'N/A')}")
            
            print("\n學校評分:")
            for school, score_info in result.get("school_scores", {}).items():
                print(f"   {school}: {score_info.get('score', 'N/A')} - {score_info.get('reason', 'N/A')}")
            
            recommendations = result.get("recommendations", {})
            print(f"\n推薦結果:")
            print(f"   最佳學系: {recommendations.get('best_department', 'N/A')}")
            print(f"   最佳學校: {recommendations.get('best_school', 'N/A')}")
            print(f"   整體建議: {recommendations.get('overall_reasoning', 'N/A')}")
        else:
            print(f"❌ 相似性分析失敗: {response.status_code}")
            print(f"錯誤訊息: {response.text}")
            
    except Exception as e:
        print(f"❌ 請求失敗: {str(e)}")

if __name__ == "__main__":
    print("🚀 AI 智能匹配系統測試")
    print("=" * 60)
    
    # 測試智能匹配
    test_smart_match()
    
    # 測試相似性分析
    test_similarity_analysis()
    
    print("\n✨ 測試完成!") 