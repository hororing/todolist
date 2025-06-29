# GitHub Pages 배포 가이드

## 1단계: GitHub 계정 생성 및 저장소 만들기

1. [GitHub.com](https://github.com)에 가입하거나 로그인
2. "New repository" 클릭
3. 저장소 이름을 `todo-app` 또는 원하는 이름으로 설정
4. "Public" 선택 (무료 계정의 경우)
5. "Create repository" 클릭

## 2단계: 파일 업로드

### 방법 A: 웹 인터페이스 사용
1. 생성된 저장소 페이지에서 "uploading an existing file" 클릭
2. `index.html`, `style.css`, `script.js`, `README.md` 파일들을 드래그 앤 드롭
3. "Commit changes" 클릭

### 방법 B: Git 명령어 사용 (터미널)
```bash
# 현재 폴더에서
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/사용자명/저장소명.git
git push -u origin main
```

## 3단계: GitHub Pages 활성화

1. 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. "Source" 섹션에서 "Deploy from a branch" 선택
4. "Branch" 드롭다운에서 "main" 선택
5. "Save" 클릭

## 4단계: 사이트 접속

몇 분 후 `https://사용자명.github.io/저장소명`으로 접속 가능!

예: `https://john.github.io/todo-app` 