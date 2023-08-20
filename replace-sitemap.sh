# 각 사이트 경로에 후행 슬래시 추가
sed -i "" 's/<\/loc>/\/<\/loc>/g' ./public/sitemap-pages.xml

# 홈페이지 경로 수정
sed -i "" 's/devkimc.github.io\/\//devkimc.github.io/g' ./public/sitemap-pages.xml